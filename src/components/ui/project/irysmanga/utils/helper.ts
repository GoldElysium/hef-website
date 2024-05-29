import {
	MangaData, Manga, PageLayout, getMangaDataOrThrow,
} from './types';
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
        if (pageLayout === "single") {
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
export const handleChapterNavigation = (
    setChapter: React.Dispatch<React.SetStateAction<number>>,
    selectedChapter: number,
    language: string,
    manga: Manga
) => {
    let mangaData = getMangaDataOrThrow(manga, language);
    let maxChapterCount = mangaData.chapterCount;
    if (0 <= selectedChapter && selectedChapter < maxChapterCount) {
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

//  Dummy data
export function generateDummyManga(): Manga {
    const tmpChapterCount = 2;
    const tmpMangaData: MangaData[] = [
        {
            title: "BroRys BL Manga",
            language: "en",
            description: "",
            chapterCount: tmpChapterCount,
            chapters: [],
        },
        {
            title: "BroRys BL Manga (JP)",
            language: "jp",
            description: "",
            chapterCount: tmpChapterCount,
            chapters: [],
        },
    ];

    for (let i = 1; i <= tmpChapterCount; ++i) {
        const enTmpPages: string[] = [];
        const jpTmpPages: string[] = [];
        const tmp = 11;
        const tmpPageCount = 9;
        for (let j = 1; j <= tmpPageCount; ++j) {
            enTmpPages.push(
                `https://alt.hololive.tv/wp-content/uploads/2022/${tmp}/en${
                    i + 1
                }_0${j}.jpg`
            );
            jpTmpPages.push(
                `https://alt.hololive.tv/wp-content/uploads/2022/${tmp}/jp${
                    i + 1
                }_0${j}.jpg`
            );
        }
        let en_title = "Short title";
        let jp_title = "短いタイトル";
        if (i == 2) {
            en_title = "Super duper long title";
            jp_title = "めちゃくちゃ長いタイトル";
        }
        tmpMangaData[0].chapters.push({
            title: en_title,
            pageCount: tmpPageCount,
            pages: enTmpPages,
        });
        tmpMangaData[1].chapters.push({
            title: jp_title,
            pageCount: tmpPageCount,
            pages: jpTmpPages,
        });
    }

    const manga: Manga = {
        id: "test-manga",
        publishedDate: new Date("2024-01-16"),
        authors: [],
        artists: [],
        data: new Map([
            ["en", tmpMangaData[0]],
            ["jp", tmpMangaData[1]],
        ]),
    };
    return manga;
}
