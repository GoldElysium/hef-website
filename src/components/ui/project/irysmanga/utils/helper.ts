import { Manga, PageLayout, getMangaDataOrThrow } from './types';
/* eslint-disable */
export const handlePageNavigation = (
    selectedPage: number,
    pageLayout: PageLayout,
    setPage: React.Dispatch<React.SetStateAction<number>>,
    setChapter: React.Dispatch<React.SetStateAction<number>>,
    chapter: number,
    language: string,
    manga: Manga
) => {
    let mangaData = getMangaDataOrThrow(manga, language);
    let currentChapter = mangaData.chapters[chapter];
    // Case: Change to the previous chapter if the page index is < 0
    if (selectedPage < 0 && chapter > 0 && chapter <= mangaData.chapterCount) {
        setPage(mangaData.chapters[chapter - 1].pageCount - 1);
        setChapter((prev) => prev - 1);
    }
    // Case: Change to the next chapter if the page index is >= currentChapter.pageCount
    else if (
        selectedPage >= currentChapter.pageCount &&
        chapter >= 0 &&
        chapter < mangaData.chapterCount - 1
    ) {
        setPage(0);
        setChapter((prev) => prev + 1);
    }
    // Case: Change to the selected page
    else if (
        selectedPage >= 0 &&
        selectedPage <= currentChapter.pageCount - 1
    ) {
        setPage(selectedPage);
    }
};
export const handleChapterNavigation = (
    setChapter: React.Dispatch<React.SetStateAction<number>>,
    setPage: React.Dispatch<React.SetStateAction<number>>,
    selectedChapter: number,
    language: string,
    manga: Manga
) => {
    let mangaData = getMangaDataOrThrow(manga, language);
    let maxChapterCount = mangaData.chapterCount;
    if (0 <= selectedChapter && selectedChapter < maxChapterCount) {
        setPage(0);
        setChapter(selectedChapter);
    }
};
// eslint-enable

// From the current option, get the next option (based on the index) in an option list
export const getNextOption = <T extends string>(
    option: T,
    optionList: ReadonlyArray<T>
): T => {
    const currentIndex = optionList.indexOf(option);
    const nextIndex = (currentIndex + 1) % optionList.length;
    return optionList[nextIndex];
};
