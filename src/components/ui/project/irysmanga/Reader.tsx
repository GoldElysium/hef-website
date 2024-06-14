'use client';

import classNames from 'classnames';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { useMangaContext } from './context/MangaContext';
import { handlePageNavigation } from './utils/helper';
import ProgressBar from './ProgressBar';
import { getMangaDataOrThrow } from './utils/types';
import ReaderHeader from './ReaderHeader';
import styles from './styles/Reader.module.css';
import LoadingIcon from './LoadingIcon';

interface Props {
	setOpenSidebar: React.Dispatch<React.SetStateAction<boolean>>;
	containerRef: React.RefObject<HTMLDivElement>;
	clickCounter: number;
	setClickCounter: React.Dispatch<React.SetStateAction<number>>;
}

function Reader({
	setOpenSidebar,
	clickCounter,
	setClickCounter,
	containerRef,
}: Props) {
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

	// Sets the scrollbar to the correct position on page change
	const setScrollTopToPage = () => {
		if (containerRef.current) {
			scriptedScroll.current = true;
			const targetImg = pageRefs.current[page];
			if (targetImg) {
				// eslint-disable-next-line
                containerRef.current.scrollTop =
                    targetImg.offsetTop - containerRef.current.offsetTop;
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

	/* eslint-disable */
    useEffect(() => {
        handleScrollTop();
    }, [page, chapter, pageLayout]);

    useEffect(() => {
        setScrollTopToPage();
    }, [fitMode]);
    // eslint-enable

	let displayedPages: React.JSX.Element[] = [];
	if (mangaData.chapters[chapter]) {
		const currentChapter = mangaData.chapters[chapter];
		const maxPageCount = currentChapter.pageCount;
		// Use optimized pages if we have them, otherwise fall back to unoptimized I guess.
		const currentPages =
			optimizedImages.get(currentChapter.title) ?? currentChapter.pages;
		const getClassNames = (i: number) => {
			const blockStyle =
				pageLayout === "single"
					? {
						block: i === page,
						hidden: i !== page,
					}
					: {
						block: true,
					};
			const containerStyle = loading[i] ? "min-h-full" : "";

			return classNames(containerStyle, blockStyle, {
				[styles.pageHeight]: fitMode === "height",
				[styles.pageWidth]: fitMode === "width",
				[styles.pageMedium]: fitMode === "original",
			});
		};

        displayedPages = Array.from({ length: maxPageCount }, (_, i) => (
			<div
				className={getClassNames(i) + " relative"}
				ref={(el) => {
					pageRefs.current[i] = el as HTMLImageElement;
				}}
				key={`page ${i}`}
			>
				{loading[i] && <LoadingIcon></LoadingIcon>}
				<Image
					key={i}
					src={currentPages[i]}
					quality={100}
					className={getClassNames(i) + " " + styles.page}
					priority={getPriority(i, page)}
					alt={`Page ${i + 1}`}
					width={"0"}
					height={1080}
					style={{ opacity: loading[i] ? "0" : "1" }}
					onLoad={() => {
						setLoading((currentLoading) =>
							currentLoading.map((curr, index) => index === i ? false : curr)
						);
					}}
				/>
			</div>
		));
	}

	return (
		<div className="flex flex-col h-screen relative grow bg-base-100 transition-colors">
			<ReaderHeader setOpenSidebar={setOpenSidebar}></ReaderHeader>
			<div
				ref={containerRef}
				className={styles.pageContainer}
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

export default Reader;
