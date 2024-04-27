import { MangaInfo } from './types';
/* eslint-disable */
export const handlePageNavigation = (
    selectedPage: number,
    setPage: React.Dispatch<React.SetStateAction<number>>,
    setChapter: React.Dispatch<React.SetStateAction<number>>,
    chapter: number,
    manga: MangaInfo
) => {
    let currentChapter = manga.chapters[chapter];
    if (selectedPage < 0 && chapter > 0 && chapter <= manga.chapterCount) {
        setPage(manga.chapters[chapter - 1].pageCount - 1);
        setChapter((prev) => prev - 1);
    } else if (
        selectedPage >= currentChapter.pageCount &&
        chapter >= 0 &&
        chapter < manga.chapterCount - 1
    ) {
        setPage(0);
        setChapter((prev) => prev + 1);
    } else if (
        selectedPage >= 0 &&
        selectedPage <= currentChapter.pageCount - 1
    ) {
        setPage(selectedPage);
    }
};
// eslint-enable
