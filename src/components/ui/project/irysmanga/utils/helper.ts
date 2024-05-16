import { Manga, getMangaDataOrThrow } from './types';
/* eslint-disable */
export const handlePageNavigation = (
    selectedPage: number,
    singlePageMode: boolean,
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
        if (singlePageMode) {
            setPage(mangaData.chapters[chapter - 1].pageCount - 1);
        } else {
            setPage(0);
        }
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
// eslint-enable
