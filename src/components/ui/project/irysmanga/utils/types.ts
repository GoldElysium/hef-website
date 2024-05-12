export interface Page {
	imageBlob: string; // temporary representation
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
	const src = '/assets/irysmanga/tmp/';
	const manga: MangaInfo = {
		title: 'BroRys BL Manga',
		chapterCount: 4,
		chapters: [
			{
				title: 'Chapter 1',
				pageCount: 1,
				pages: [{ imageBlob: `${src}1-1.jpg` }],
			},
			{
				title: 'Chapter 2',
				pageCount: 1,
				pages: [{ imageBlob: `${src}2-1.jpg` }],
			},
			{
				title: 'Chapter 3',
				pageCount: 2,
				pages: [
					{ imageBlob: `${src}3-1.jpg` },
					{ imageBlob: `${src}3-2.jpg` },
				],
			},
			{
				title: 'Chapter 4',
				pageCount: 3,
				pages: [
					{ imageBlob: `${src}4-1.jpg` },
					{ imageBlob: `${src}4-2.jpg` },
					{ imageBlob: `${src}4-3.jpg` },
				],
			},
		],
	};

	return manga;
}
