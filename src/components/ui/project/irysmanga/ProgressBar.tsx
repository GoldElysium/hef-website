import { useState } from 'react';
import classNames from 'classnames';
import { useMangaContext } from './context/MangaContext';
import { getMangaDataOrThrow } from './utils/types';
import styles from './styles/ProgressBar.module.css';

function ProgressBar() {
	const {
		language, page, chapter, manga, progressVisibility, setPage,
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
        let sectionClasses = styles.progressSectionTooltip;
        if (isActive) {
            sectionClasses = sectionClasses.concat(
                " " + styles.progressSectionTooltipActive
            );
        }
        if (isSelected) {
            sectionClasses = sectionClasses.concat(
                " " + styles.progressSectionTooltipSelected
            );
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
                className={classNames(styles.progressOuterContainer, {
                    [styles.progressOuterContainerOpen]:
                        progressVisibility === "progress-shown",
                    [styles.progressOuterContainerClose]:
                        progressVisibility === "progress-hidden",
                })}
                onMouseEnter={() => setOpenProgress(true)}
                onMouseLeave={() => setOpenProgress(false)}
            >
                <div
                    className={classNames(styles.progressInnerContainer, {
                        [styles.progressInnerContainerOpen]: openProgress,
                        [styles.progressInnerContainerClose]: !openProgress,
                    })}
                >
                    <div className={styles.numberLabelContainer}>
                        <span
                            className={classNames(styles.numberLabel, {
                                [styles.numberLabelOpen]: openProgress,
                                [styles.numberLabelClose]: !openProgress,
                            })}
                        >
                            1
                        </span>
                    </div>
                    <div className={styles.progressBarContanier}>
                        <div className={styles.progressSectionsContainer}>
                            {pageSections}
                        </div>
                    </div>
                    <div className={styles.numberLabelContainer}>
                        <span
                            className={classNames(styles.numberLabel, {
                                [styles.numberLabelOpen]: openProgress,
                                [styles.numberLabelClose]: !openProgress,
                            })}
                        >
                            {pageCount}
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ProgressBar;
