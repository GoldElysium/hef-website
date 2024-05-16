export type Chapter = {
	title: string;
	pageCount: number;
	pages: string[];
};

export type MangaData = {
	title: string;
	language: string;
	chapterCount: number;
	chapters: Chapter[];
	description: string;
};

export type Contributor = {
	name: string;
	socials: {
		platform: string;
		link: string;
	}[];
};

export type Manga = {
	id: string;
	publishedDate: Date;
	authors: Contributor[];
	artists: Contributor[];
	data: Map<string, MangaData>; // Maps ISO language codes to correct data.
};

// Returns the correct MangaData object for a given language. If there is no such manga data
// for the given language, throw an error.
export function getMangaDataOrThrow(manga: Manga, language: string): MangaData {
	if (manga === undefined || manga === null) {
		throw new Error('manga object is undefined/null.');
	}

	const mangaData = manga.data.get(language);
	if (mangaData === undefined) {
		throw new RangeError(`No manga data for language "${language}".`);
	}

	return mangaData;
}

//  Dummy data
export function generateDummyManga(): Manga {
	const tmpChapterCount = 2;
	const tmpMangaData: MangaData[] = [
		{
			title: 'BroRys BL Manga',
			language: 'en',
			description: '',
			chapterCount: tmpChapterCount,
			chapters: [],
		},
		{
			title: 'BroRys BL Manga (JP)',
			language: 'jp',
			description: '',
			chapterCount: tmpChapterCount,
			chapters: [],
		},
	];

	for (let i = 1; i <= tmpChapterCount; ++i) {
		const enTmpPages: string[] = [];
		const jpTmpPages: string[] = [];
		const tmp = 11;
		for (let j = 1; j <= 10; ++j) {
			enTmpPages.push(`https://alt.hololive.tv/wp-content/uploads/2022/${tmp}/en${i + 1}_0${j}.jpg`);
			jpTmpPages.push(`https://alt.hololive.tv/wp-content/uploads/2022/${tmp}/jp${i + 1}_0${j}.jpg`);
		}
		tmpMangaData[0].chapters.push(
			{
				title: `Chapter ${i}`,
				pageCount: 10,
				pages: enTmpPages,
			},
		);
		tmpMangaData[1].chapters.push(
			{
				title: `Chapter ${i}`,
				pageCount: 10,
				pages: jpTmpPages,
			},
		);
	}

	const manga: Manga = {
		id: 'test-manga',
		publishedDate: new Date('2024-01-16'),
		authors: [],
		artists: [],
		data: new Map([['en', tmpMangaData[0]], ['jp', tmpMangaData[1]]]),
	};

	return manga;
}
