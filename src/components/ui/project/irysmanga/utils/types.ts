export interface Page {
	// image blob of a page
}

export interface Chapter {
	title: string;
	pageCount: number;
	pages: Page[];
}

export interface MangaInfo {
	chapterCount: number;
	chapters: Chapter[];
}

// dummy data
const dummyChapters: Chapter[] = Array.from({ length: 10 }, (_, index) => ({
	title: `Chapter ${index + 1}`,
	pageCount: 10,
	pages: [],
}));

const dummyMangaInfo: MangaInfo = {
	chapterCount: dummyChapters.length,
	chapters: dummyChapters,
};

export default dummyMangaInfo;
