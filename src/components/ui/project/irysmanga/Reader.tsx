import classNames from 'classnames';
import React, { useEffect, useRef } from 'react';
import { useMangaContext } from './context/MangaContext';
import { handlePageNavigation } from './utils/helper';
import ProgressBar from './ProgressBar';
import { getMangaDataOrThrow } from './utils/types';
import ReaderHeader from './ReaderHeader';
import styles from './styles/Reader.module.css';

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
	} = useMangaContext();

	// const containerRef = useRef<HTMLDivElement>(null);
	const pageRefs = useRef<HTMLImageElement[]>([]);
	const pageScrolled = useRef(false);
	const scriptedScroll = useRef(false);

	// Sets the scrollbar to the correct position on page change
	const setScollTopToPage = () => {
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
			setScollTopToPage();
		}
		if (pageLayout === 'single') {
			setScollTopToPage();
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
	const shouldPreload = (numPages: number, pg: number): ('eager' | 'lazy') => (Math.abs(numPages - pg) > 3 ? 'lazy' : 'eager');

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

	// eslint-disable-next-line
    useEffect(() => {
		handleScrollTop();
	}, [page, chapter, pageLayout]);

	// eslint-disable-next-line
    useEffect(() => {
		setScollTopToPage();
	}, [fitMode]);

	let displayedPages: React.JSX.Element[] = [];
	const mangaData = getMangaDataOrThrow(manga, mangaLanguage);
	if (mangaData.chapters[chapter]) {
		const currentChapter = mangaData.chapters[chapter];
		const maxPageCount = currentChapter.pageCount;
		const currentPages = currentChapter.pages;

		/* eslint-disable */
        if (pageLayout === "single") {
            displayedPages = Array.from({ length: maxPageCount }, (_, i) => (
                <img
                    key={i}
                    ref={(el) => (pageRefs.current[i] = el as HTMLImageElement)}
                    src={currentPages[i]}
                    className={classNames(styles.page, {
                        block: i === page,
                        hidden: i !== page,
                        [styles.pageHeight]: fitMode === "height",
                        [styles.pageWidth]: fitMode === "width",
                    })}
                    alt={`Page ${i + 1}`}
					loading={shouldPreload(i, page)}
                />
            ));
        } else {
            displayedPages = Array.from({ length: maxPageCount }, (_, i) => (
                <img
                    key={i}
                    ref={(el) => (pageRefs.current[i] = el as HTMLImageElement)}
                    src={currentPages[i]}
                    className={classNames(styles.page, {
                        block: true,
                        [styles.pageHeight]: fitMode === "height",
                        [styles.pageWidth]: fitMode === "width",
                    })}
                    alt={`Page ${i + 1}`}
					loading={shouldPreload(i, page)} // Preload up to 3 pages in advance.
                />
            ));
        }

        // eslint-enable
    }

    /* eslint-disable */
    return (
        <div className="flex flex-col h-screen relative grow bg-base-100 transition-colors">
            <ReaderHeader setOpenSidebar={setOpenSidebar}></ReaderHeader>
            <div
                ref={containerRef}
                className={styles.pageContainer}
                onClick={handleClick}
                onScroll={handleScroll}
                tabIndex={0}
            >
                {displayedPages}
            </div>
            <div className="absolute bottom-0 left-0 w-full">
                <ProgressBar></ProgressBar>
            </div>
        </div>
    );
    // eslint-enable
}

export default Reader;
