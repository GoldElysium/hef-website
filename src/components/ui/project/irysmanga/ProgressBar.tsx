import { useState } from 'react';
import classNames from 'classnames';
import { useMangaContext } from './context/MangaContext';
import { getMangaDataOrThrow } from './utils/types';

function ProgressBar() {
	const {
		language, page, chapter, manga, setPage,
	} = useMangaContext();

	const mangaData = getMangaDataOrThrow(manga, language);
	const { pageCount } = mangaData.chapters[chapter];

	// Handle click on a specific page section
	const handlePageSectionClick = (
		event: React.MouseEvent<HTMLDivElement>,
		pageNumber: number,
	) => {
		event.stopPropagation();
		setPage(pageNumber);
	};

	/* eslint-disable */
    const pageSections = [];
    for (let i = 0; i < pageCount; i++) {
        const isActive = i < page;
        const isSelected = i === page;
        let sectionClasses = "progress-section-tooltip";
        if (isActive) {
            sectionClasses = sectionClasses.concat(" active");
        }
        if (isSelected) {
            sectionClasses = sectionClasses.concat(" selected");
        }
        /* eslint-disable */

        pageSections.push(
            <div
                className={sectionClasses}
                data-tip={i + 1}
                onClick={(e) => handlePageSectionClick(e, i)}
                key={`progress ${i}`}
            ></div>
        );
    }

    // eslint-enable
    const [openProgress, setOpenProgress] = useState(false);
    return (
        <>
            <div
                className="sticky bg-transparent z-10 w-full h-[60px] flex items-end"
                onMouseEnter={() => setOpenProgress(true)}
                onMouseLeave={() => setOpenProgress(false)}
            >
                <div
                    className={classNames(
                        "w-[100%] bg-gray-400 rounded-lg z-10 transition-all duration-100 ease-linear",
                        {
                            "h-[20px] opacity-100": openProgress,
                            "opacity-50 h-[7px] md:h-[10px]": !openProgress,
                        }
                    )}
                >
                    <div className="flex justify-between w-full h-full">
                        {pageSections}
                    </div>
                </div>
            </div>
        </>
    );
}

export default ProgressBar;
