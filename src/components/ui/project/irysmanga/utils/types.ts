export interface Page {
	EN: string;
	JP: string;
}

export interface Chapter {
	title: string;
	pageCount: number;
	pages: Page[];
}

export interface MangaInfo {
	title: string;
	chapterCount: number;
	chapters: Chapter[];
}

//  Dummy data
export function generateDummyManga(): MangaInfo {
	// const src = "/assets/irysmanga/tmp/";
	const tmpChapters: Chapter[] = [];
	const tmpChapterCount = 2;
	for (let i = 1; i <= tmpChapterCount; ++i) {
		const tmpPages: Page[] = [];
		const tmp = 11;
		for (let j = 1; j <= 10; ++j) {
			tmpPages.push({
				EN: `https://alt.hololive.tv/wp-content/uploads/2022/${tmp}/en${
					i + 1
				}_0${j}.jpg`,
				JP: `https://alt.hololive.tv/wp-content/uploads/2022/${tmp}/jp${
					i + 1
				}_0${j}.jpg`,
			});
		}
		tmpChapters.push({
			title: `Chapter ${i}`,
			pageCount: 10,
			pages: tmpPages,
		});
	}
	const manga: MangaInfo = {
		title: 'BroRys BL Manga',
		chapterCount: tmpChapterCount,
		chapters: tmpChapters,
	};

	return manga;
}
