'use client';

import classNames from 'classnames';
import NextImage from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { useMangaContext } from './context/MangaContext';
import { handlePageNavigation } from './utils/helper';
import ProgressBar from './ProgressBar';
import { getMangaDataOrThrow } from './utils/types';
import ReaderHeader from './ReaderHeader';
import styles from './styles/Reader.module.css';
import LoadingIcon from './LoadingIcon';

interface IProps {
	openSidebar: boolean
	setOpenSidebar: React.Dispatch<React.SetStateAction<boolean>>;
	containerRef: React.RefObject<HTMLDivElement>;
	clickCounter: number;
	setClickCounter: React.Dispatch<React.SetStateAction<number>>;
}

export default function Reader({
	openSidebar,
	setOpenSidebar,
	clickCounter,
	setClickCounter,
	containerRef,
}: IProps) {
	const {
		pageLayout,
		fitMode,
		page,
		setPage,
		setChapter,
		chapter,
		manga,
		direction,
		mangaLanguage,
		optimizedImages,
	} = useMangaContext();

	const mangaData = getMangaDataOrThrow(manga, mangaLanguage);
	// const containerRef = useRef<HTMLDivElement>(null);
	const pageRefs = useRef<HTMLImageElement[]>([]);
	const pageScrolled = useRef(false);
	const scriptedScroll = useRef(false);
	const [loading, setLoading] = useState<boolean[]>(
		Array(mangaData.chapters[chapter].pageCount).fill(true),
	);
	const [containerDimensions, setContainerDimensions] = useState({
		width: 0,
		height: 0,
	});

	// Sets the scrollbar to the correct position on page change
	const setScrollTopToPage = () => {
		if (containerRef.current) {
			scriptedScroll.current = true;
			const targetImg = pageRefs.current[page];
			if (targetImg) {
				// eslint-disable-next-line no-param-reassign
				containerRef.current.scrollTop = targetImg.offsetTop - containerRef.current.offsetTop;
			}
		}
	};
	const handleScrollTop = () => {
		if (pageLayout !== 'single' && !pageScrolled.current) {
			setScrollTopToPage();
		}
		if (pageLayout === 'single') {
			setScrollTopToPage();
		}
		pageScrolled.current = false;
	};

	// Update the page counter when the user scrolls
	const handleScroll = () => {
		if (!containerRef.current || scriptedScroll.current) {
			scriptedScroll.current = false;
			return;
		}
		const containerRect = containerRef.current.getBoundingClientRect();
		const imgRect = pageRefs.current[page].getBoundingClientRect();
		const offset = 100;
		if (imgRect.bottom - offset <= containerRect.top) {
			pageScrolled.current = true;
			setPage(page + 1);
		} else if (imgRect.top + offset >= containerRect.bottom) {
			pageScrolled.current = true;
			setPage(page - 1);
		}
	};

	/**
	 * Check whether we should preload an image for a page.
	 * Note we preload a few pages in advance (or behind just in case you try jumping pages)
	 * for a better reading experience, but we don't want to load all the images at once
	 * because that might be slow.
	 */
	const getPriority = (numPages: number, pg: number): boolean => Math.abs(numPages - pg) <= 3;

	// Handle page turn on click
	const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
		const { clientX, target } = event;
		const { left, width } = (target as HTMLElement).getBoundingClientRect();

		if (window.innerWidth <= 768) {
			if (clickCounter < 0) {
				setClickCounter((prev) => prev + 1);
				return;
			}
		}

		const position = clientX - left;
		const threshold = width / 2;
		scriptedScroll.current = true;
		if (position < threshold) {
			if (direction === 'ltr') {
				handlePageNavigation(
					page - 1,
					pageLayout,
					setPage,
					setChapter,
					chapter,
					mangaLanguage,
					manga,
				);
			} else {
				handlePageNavigation(
					page + 1,
					pageLayout,
					setPage,
					setChapter,
					chapter,
					mangaLanguage,
					manga,
				);
			}
		} else if (direction === 'ltr') {
			handlePageNavigation(
				page + 1,
				pageLayout,
				setPage,
				setChapter,
				chapter,
				mangaLanguage,
				manga,
			);
		} else {
			handlePageNavigation(
				page - 1,
				pageLayout,
				setPage,
				setChapter,
				chapter,
				mangaLanguage,
				manga,
			);
		}
	};

	useEffect(() => {
		handleScrollTop();
	}, [page, chapter, pageLayout]);

	useEffect(() => {
		setScrollTopToPage();
	}, [fitMode]);

	let displayedPages: React.JSX.Element[] = [];
	if (mangaData.chapters[chapter]) {
		const currentChapter = mangaData.chapters[chapter];
		const maxPageCount = currentChapter.pageCount;
		// Use optimized pages if we have them, otherwise fall back to unoptimized I guess.
		const currentPages = optimizedImages.get(currentChapter.id) ?? currentChapter.pages;

		/**
		 * Returns class names for the page _container_.
		 */
		const getClassNamesContainer = (i: number) => {
			const blockStyle = (
				pageLayout === 'single'
					? {
						block: i === page,
						hidden: i !== page,
					}
					: {
						block: true,
					}
			);

			const fitStyle = {
				// For height mode, we force the image to fit on the y-axis and then get width to scale.
				// Width will overflow on the container-level if necessary.
				'w-auto h-full overflow-x-auto': fitMode === 'height',

				// For width mode, we force the image to fit on the x-axis and then get height to scale.
				// Note that height should overflow to the parent level.
				'w-full h-auto overflow-x-auto overflow-y-visible': fitMode === 'width',

				// Basically, overflow on width and then let the outer parent handle height.
				'max-w-full h-max overflow-x-auto overflow-y-visible ': fitMode === 'original',

				// Cap on container width and height; we use object-cover on the child to then make it fit.
				'max-w-full max-h-full overflow-auto': fitMode === 'fit-both',
			};

			return classNames(blockStyle, fitStyle, 'flex shrink-0');
		};

		/**
		 * Returns class names for the page image itself.
		 */
		const getClassNamesPageImage = () => {
			const fitStyle = {
				// With fit-both, we can just use object-contain and call it a day.
				'object-contain': fitMode === 'fit-both',

				// For height, make it take the full available height and let width auto-scale.
				'h-full w-auto': fitMode === 'height',

				// For width, just make it follow width and let height auto-scale.
				'w-full h-auto': fitMode === 'width',
			};

			return classNames(fitStyle);
		};

		/**
		 * Return styles for the page image.
		 */
		const getPageImageFitStyles = (width: number, height: number) => {
			if (fitMode === 'original') {
				// I could probably move this to `getClassNamesPageImage` but eh, this works and I'm lazy.
				return {
					width, height, maxWidth: width, maxHeight: height,
				};
			}

			return {};
		};

		displayedPages = Array.from({ length: maxPageCount }, (_, i) => {
			const originalImage = new Image();
			originalImage.src = currentPages[i];

			const fitStyles = getPageImageFitStyles(originalImage.width, originalImage.height);

			return (
				<div
					className={`${getClassNamesContainer(i)}`}
					key={`page-${i}`}
					ref={(el) => {
						pageRefs.current[i] = el as HTMLImageElement;
					}}
					style={{
						scrollbarWidth: 'none', msOverflowStyle: 'none',
					}}
				>
					{loading[i] && <LoadingIcon />}
					<NextImage
						src={currentPages[i]}
						className={getClassNamesPageImage()}
						quality={100}
						priority={getPriority(i, page)}
						alt={`Page ${i + 1}`}
						width={originalImage.width}
						height={originalImage.height}
						style={{
							opacity: loading[i] ? '0' : '1', ...fitStyles,
						}}
						onLoad={() => {
							setLoading((currentLoading) => currentLoading
								.map((curr, index) => (index === i ? false : curr)));
						}}
					/>
				</div>
			);
		});
	}

	useEffect(() => {
		const handleResize = () => {
			if (containerRef.current) {
				const { clientWidth, clientHeight } = containerRef.current;
				setContainerDimensions({
					width: clientWidth,
					height: clientHeight,
				});
			}
		};
		window.addEventListener('resize', handleResize);
		handleResize();

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, [containerRef, fitMode]);

	return (
		<div className="relative flex max-h-full max-w-full grow flex-col overflow-hidden">
			<ReaderHeader openSidebar={openSidebar} setOpenSidebar={setOpenSidebar} />
			{/* eslint-disable-next-line max-len */}
			{/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
			<div
				ref={containerRef}
				className={classNames(styles.pagesWrapper, {
					// We add this check as without it vertical scrolling can break. As such, this
					// disables it if scrolling is required!
					'justify-center':
						pageLayout === 'single'
						&& (pageRefs.current[page]
							&& containerDimensions.height > pageRefs.current[page].clientHeight),
				})}
				onClick={handleClick}
				onScroll={handleScroll}
			>
				{displayedPages}
			</div>
			<div className="absolute bottom-0 left-0 w-full">
				<ProgressBar />
			</div>
		</div>
	);
}
