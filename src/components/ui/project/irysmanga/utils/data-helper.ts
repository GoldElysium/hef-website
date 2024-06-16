import { Contributor, Manga, MangaData } from './types';

function getMangaFromDevProps(devProps: { [key: string]: string }): Manga {
	if (!devProps.mangaData) {
		throw new Error('No manga data found.');
	}

	return JSON.parse(devProps.mangaData);
}

function getDummyContributors(role: string): Contributor[] {
	return Array.from({ length: 5 }, (_, i) => ({
		// eslint-disable-next-line no-plusplus
		name: `${role} name ${i}`,
		socials: [
			{
				platform: 'Twitter',
				link: '',
			},
			{
				platform: 'Pixiv',
				link: '',
			},
			{
				platform: 'Github',
				link: '',
			},
		],
	}));
}

function getDummyManga(): Manga {
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
		const tmpPageCount = 9;
		for (let j = 1; j <= tmpPageCount; ++j) {
			enTmpPages.push(
				`https://alt.hololive.tv/wp-content/uploads/2022/${tmp}/en${i + 1}_0${j}.jpg`,
			);
			jpTmpPages.push(
				`https://alt.hololive.tv/wp-content/uploads/2022/${tmp}/jp${i + 1}_0${j}.jpg`,
			);
		}
		const enTitle = i === 2 ? 'Super duper long title' : 'Short title';
		const jpTitle = i === 2 ? 'めちゃくちゃ長いタイトル' : '短いタイトル';

		tmpMangaData[0].chapters.push({
			id: 'en-ch-1',
			title: enTitle,
			pageCount: tmpPageCount,
			pages: enTmpPages,
		});
		tmpMangaData[1].chapters.push({
			id: 'jp-ch-1',
			title: jpTitle,
			pageCount: tmpPageCount,
			pages: jpTmpPages,
		});
	}

	return {
		id: 'test-manga',
		publishedDate: '2024-01-16',
		authors: getDummyContributors('Author'),
		artists: getDummyContributors('Artist'),
		translators: getDummyContributors('Translator'),
		devs: getDummyContributors('Developer'),
		data: {
			en: tmpMangaData[0],
			jp: tmpMangaData[1],
		},
	};
}

// https://stackoverflow.com/questions/679915/how-do-i-test-for-an-empty-javascript-object
function objIsEmpty(obj: any): boolean {
	return Object.keys(obj).length === 0;
}

export default function getManga(devProps: { [key: string]: string }): Manga {
	if (process.env.NODE_ENV !== 'production' && (!process.env.NEXT_PUBLIC_CMS_URL || objIsEmpty(devProps))) {
		return getDummyManga();
	}

	// TODO: Remove this before deploying to prod
	const useDummy = true;
	if (useDummy) {
		return getDummyManga();
	}

	return getMangaFromDevProps(devProps);
}
