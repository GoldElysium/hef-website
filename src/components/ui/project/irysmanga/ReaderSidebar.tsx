import SelectBox from './SelectBox';
import { useMangaContext } from './context/MangaContext';

function ReaderSidebar() {
	const {
		singlePageMode,
		setSinglePageMode,
		fitHeightMode,
		setFitHeightMode,
		page,
		setPage,
		chapter,
		setChapter,
		isEnglish,
		setIsEnglish,
		leftToRight,
		setLeftToRight,
		headerHidden,
		setHeaderHidden,
		isLightTheme,
		setIsLightTheme,
		manga,
	} = useMangaContext();
	return (
		<div className="flex w-3/12 flex-col px-4 py-2">
			{/* Manga info */}
			<div className="flex flex-col gap-2">
				<div className="flex items-center gap-1">
					<img src="/assets/irysmanga/title.svg" width={30} alt="" />
					<strong>BroRys BL Manga</strong>
				</div>
				<div className="flex items-center gap-1">
					<img
						src="/assets/irysmanga/chapter.svg"
						width={30}
						alt=""
					/>
					<strong>{manga.chapters[chapter].title}</strong>
				</div>
				<button className="btn" type="button">
					Details
				</button>
				<button
					className="btn"
					type="button"
					onClick={() => {
						setIsEnglish((prev) => !prev);
					}}
				>
					Language:
					{' '}
					{isEnglish ? 'English' : '日本語'}
				</button>
			</div>
			<div className="divider" />
			{/* Chapter and page seletion */}
			<div className="flex flex-col items-center gap-2">
				<SelectBox
					value={page}
					label="Page"
					maxValue={manga.chapters[chapter].pageCount}
					manga={manga}
					currentChapterValue={chapter}
					pageSetFunction={setPage}
					chapterSetFunction={setChapter}
				/>
				<SelectBox
					value={chapter}
					label="Chapter"
					maxValue={manga.chapterCount}
					manga={manga}
					currentChapterValue={chapter}
					pageSetFunction={setPage}
					chapterSetFunction={setChapter}
				/>
			</div>
			<div className="divider" />
			{/* Reader settings */}
			<div className="flex flex-col gap-2">
				<button
					className="btn"
					type="button"
					onClick={() => setSinglePageMode((prev) => !prev)}
				>
					{singlePageMode ? 'Single Page' : 'Long Strip'}
				</button>
				<button
					className="btn"
					type="button"
					onClick={() => setFitHeightMode((prev) => !prev)}
				>
					{fitHeightMode ? 'Fit Height' : 'Fit Width'}
				</button>
				<button
					className="btn"
					type="button"
					onClick={() => setLeftToRight((prev) => !prev)}
				>
					{leftToRight ? 'Left To Right' : 'Right To Left'}
				</button>
				<button
					className="btn"
					type="button"
					onClick={() => setHeaderHidden((prev) => !prev)}
				>
					{headerHidden ? 'Header Hidden' : 'Header Shown'}
				</button>
				<button
					className="btn"
					type="button"
					onClick={() => setIsLightTheme((prev) => !prev)}
				>
					Theme:
					{' '}
					{isLightTheme ? 'Light' : 'Dark'}
				</button>
			</div>
		</div>
	);
}

export default ReaderSidebar;
