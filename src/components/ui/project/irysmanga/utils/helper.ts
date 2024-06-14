import { Manga, PageLayout, getMangaDataOrThrow } from './types';

export const handlePageNavigation = (
	selectedPage: number,
	_pageLayout: PageLayout,
	setPage: React.Dispatch<React.SetStateAction<number>>,
	setChapter: React.Dispatch<React.SetStateAction<number>>,
	chapter: number,
	language: string,
	manga: Manga,
) => {
	const mangaData = getMangaDataOrThrow(manga, language);
	const currentChapter = mangaData.chapters[chapter];

	if (selectedPage < 0 && chapter > 0 && chapter <= mangaData.chapterCount) {
		// Case: Change to the previous chapter if the page index is < 0
		setPage(mangaData.chapters[chapter - 1].pageCount - 1);
		setChapter((prev) => prev - 1);
	} else if (
		selectedPage >= currentChapter.pageCount
        && chapter >= 0
        && chapter < mangaData.chapterCount - 1
	) {
		// Case: Change to the next chapter if the page index is >= currentChapter.pageCount
		setPage(0);
		setChapter((prev) => prev + 1);
	} else if (
		selectedPage >= 0
        && selectedPage <= currentChapter.pageCount - 1
	) {
		// Case: Change to the selected page
		setPage(selectedPage);
	}
};

export const handleChapterNavigation = (
	setChapter: React.Dispatch<React.SetStateAction<number>>,
	setPage: React.Dispatch<React.SetStateAction<number>>,
	selectedChapter: number,
	language: string,
	manga: Manga,
) => {
	const mangaData = getMangaDataOrThrow(manga, language);
	const maxChapterCount = mangaData.chapterCount;
	if (selectedChapter >= 0 && selectedChapter < maxChapterCount) {
		setPage(0);
		setChapter(selectedChapter);
	}
};

// From the current option, get the next option (based on the index) in an option list
export const getNextOption = <T extends string>(
	option: T,
	optionList: ReadonlyArray<T>,
): T => {
	const currentIndex = optionList.indexOf(option);
	const nextIndex = (currentIndex + 1) % optionList.length;
	return optionList[nextIndex];
};
