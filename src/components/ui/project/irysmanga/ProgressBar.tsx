import { useMangaContext } from './context/MangaContext';
import { getMangaDataOrThrow } from './utils/types';

function ProgressBar() {
	const {
		language, page, chapter, manga, setPage,
	} = useMangaContext();

	const mangaData = getMangaDataOrThrow(manga, language);
	const { pageCount } = mangaData.chapters[chapter];

	const progressWidth = `${((page + 1) / pageCount) * 100}%`;

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
		const sectionClasses = isActive
			? "progress-section active"
			: "progress-section";

		pageSections.push(
			<div
				key={i}
				className={sectionClasses}
				onClick={(e) => handlePageSectionClick(e, i)}
			/>
		);
	}
	// eslint-enable

	return (
		<div className="progress-bar">
			<div className="progress-sth" style={{ width: progressWidth }} />
			<div className="progress-sections">{pageSections}</div>
		</div>
	);
}

export default ProgressBar;
