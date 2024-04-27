import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { useMangaContext } from './context/MangaContext';
import { handlePageNavigation } from './utils/helper';

function Reader() {
	const {
		singlePageMode,
		fitHeightMode,
		page,
		setPage,
		setChapter,
		chapter,
		manga,
		leftToRight,
	} = useMangaContext();

	const containerRef = useRef<HTMLDivElement>(null);
	const pageRefs = useRef<HTMLImageElement[]>([]);
	const pageScrolled = useRef(false);
	const [scrollBarSet, setScrollBarSet] = useState(false);

	const pageGap = 10;
	const imgClasses = classNames('page-img m-auto', {
		'h-full': fitHeightMode,
		visible: scrollBarSet,
		invisible: !scrollBarSet,
	});
	const containerClasses = classNames(
		`w-9/12 h-full bg-slate-600 hover:cursor-pointer overflow-y-auto flex flex-col gap-[${pageGap}px]`,
	);

	const handleScrollTop = () => {
		if (singlePageMode && containerRef.current) {
			containerRef.current.scrollTop = 0;
		}
		if (!singlePageMode && !pageScrolled.current) {
			if (containerRef.current) {
				const targetImg = pageRefs.current[page];
				if (targetImg) {
					containerRef.current.scrollTop = targetImg.offsetTop - containerRef.current.offsetTop;
				}
			}
		}
		pageScrolled.current = false;
	};
	const handleScroll = () => {
		if (!containerRef.current) {
			return;
		}
		const { scrollTop } = containerRef.current;
		const pageIndex = pageRefs.current.findIndex((img) => {
			if (
				img
                && img.offsetTop !== undefined
                && img.clientHeight !== undefined
			) {
				return (
					img.offsetTop <= scrollTop
                    && img.offsetTop + img.clientHeight > scrollTop
				);
			}
			return false;
		});

		if (pageIndex !== -1 && pageIndex !== page) {
			pageScrolled.current = true;
			setPage(pageIndex);
		}
	};

	const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
		const { clientX, target } = event;
		const { left, width } = (target as HTMLElement).getBoundingClientRect();

		const position = clientX - left;
		const threshold = width / 2;
		if (position < threshold) {
			if (leftToRight) {
				handlePageNavigation(
					page - 1,
					setPage,
					setChapter,
					chapter,
					manga,
				);
			} else {
				handlePageNavigation(
					page + 1,
					setPage,
					setChapter,
					chapter,
					manga,
				);
			}
		} else if (leftToRight) {
			handlePageNavigation(
				page + 1,
				setPage,
				setChapter,
				chapter,
				manga,
			);
		} else {
			handlePageNavigation(
				page - 1,
				setPage,
				setChapter,
				chapter,
				manga,
			);
		}
	};

	useEffect(() => {
		handleScrollTop();
	}, [page]);

	useEffect(() => {
		setScrollBarSet(false);
		if (containerRef.current) {
			setTimeout(() => {
				handleScrollTop();
				setScrollBarSet(true);
				console.log('loaded');
			}, 500);
		}
	}, [chapter]);

	let displayedPages;
	if (manga && manga.chapters[chapter]) {
		const currentChapter = manga.chapters[chapter];
		const maxPageCount = singlePageMode ? 1 : currentChapter.pageCount;
		const currentPages = currentChapter.pages;

		if (singlePageMode) {
			displayedPages = (
				<img
					key={page}
					src={currentPages[page].imageBlob}
					className={imgClasses}
					alt={`Page ${page + 1}`}
				/>
			);
		} else {
			/* eslint-disable */
            displayedPages = Array.from({ length: maxPageCount }, (_, i) => (
                <img
                    key={i}
                    ref={(el) => (pageRefs.current[i] = el as HTMLImageElement)}
                    src={currentPages[i].imageBlob}
                    className={imgClasses}
                    alt={`Page ${i + 1}`}
                />
            ));
            // eslint-enable
        }
    }
    /* eslint-disable */
    return (
        <div
            className={containerClasses}
            onClick={handleClick}
            onScroll={handleScroll}
            id="manga-reader-container"
            ref={containerRef}
        >
            {displayedPages}
        </div>
    );
    // eslint-enable
}

export default Reader;
