import { useState } from 'react';
import classNames from 'classnames';
import { useMangaContext } from './context/MangaContext';
import { getMangaDataOrThrow } from './utils/types';
import styles from './styles/ProgressBar.module.css';

export default function ProgressBar() {
	const {
		mangaLanguage,
		page,
		chapter,
		manga,
		progressVisibility,
		setPage,
		pageLayout,
	} = useMangaContext();

	const mangaData = getMangaDataOrThrow(manga, mangaLanguage);
	const { pageCount } = mangaData.chapters[chapter];

	// Handle click on a specific page section
	const handlePageSectionClick = (
		event: React.MouseEvent<HTMLDivElement>,
		pageNumber: number,
	) => {
		event.stopPropagation();
		setPage(pageNumber);
	};

	const pageSections = [];
	let firstIndex = 0;
	let lastIndex = pageCount;
	let increment = 1;
	let leftLabelValue = 1;
	let rightLabelValue = pageCount;

	if (pageLayout === 'rtl') {
		firstIndex = pageCount - 1;
		lastIndex = -1;
		increment = -1;
		leftLabelValue = pageCount;
		rightLabelValue = 1;
	}

	for (let i = firstIndex; i !== lastIndex; i += increment) {
		const isActive = i < page;
		const isSelected = i === page;

		let sectionClasses = classNames(
			styles.progressSectionTooltip,
			'my-tooltip my-tooltip-top',
		);

		if (isActive) {
			sectionClasses = sectionClasses.concat(
				` ${styles.progressSectionTooltipActive}`,
			);
		}

		if (isSelected) {
			sectionClasses = sectionClasses.concat(
				` ${styles.progressSectionTooltipSelected}`,
			);
		}

		pageSections.push(
			// eslint-disable-next-line max-len
			// eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
			<div
				className={sectionClasses}
				data-tip={i + 1}
				onClick={(e) => handlePageSectionClick(e, i)}
				key={`progress-${i}`}
			/>,
		);
	}

	const [openProgress, setOpenProgress] = useState(false);

	return (
		<div
			className={classNames(styles.progressOuterContainer, {
				[styles.progressOuterContainerOpen]:
                    progressVisibility === 'progress-shown',
				[styles.progressOuterContainerClose]:
                    progressVisibility === 'progress-hidden',
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
				<div
					className={classNames(styles.numberLabelContainer, {
						[styles.numberLabelContainerFadeLeft]: !openProgress,
					})}
				>
					<span
						className={classNames(styles.numberLabel, {
							[styles.numberLabelOpen]: openProgress,
							[styles.numberLabelClose]: !openProgress,
						})}
					>
						{leftLabelValue}
					</span>
				</div>
				<div className={styles.progressBarContainer}>
					<div className={styles.progressSectionsContainer}>
						{pageSections}
					</div>
				</div>
				<div
					className={classNames(styles.numberLabelContainer, {
						[styles.numberLabelContainerFadeRight]: !openProgress,
					})}
				>
					<span
						className={classNames(styles.numberLabel, {
							[styles.numberLabelOpen]: openProgress,
							[styles.numberLabelClose]: !openProgress,
						})}
					>
						{rightLabelValue}
					</span>
				</div>
			</div>
		</div>
	);
}
