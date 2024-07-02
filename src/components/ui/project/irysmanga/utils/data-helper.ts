import {
	Manga, MangaData,
} from './types';

function getMangaFromDevProps(devProps: { [key: string]: string }): Manga {
	if (!devProps.mangaData) {
		throw new Error('No manga data found.');
	}

	return JSON.parse(devProps.mangaData);
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
				`https://alt.hololive.tv/wp-content/uploads/2022/${tmp}/en${i + 1
				}_0${j}.jpg`,
			);
			jpTmpPages.push(
				`https://alt.hololive.tv/wp-content/uploads/2022/${tmp}/jp${i + 1
				}_0${j}.jpg`,
			);
		}
		const enTitle = i === 2 ? 'Super duper long title' : 'Short title';
		const jpTitle = i === 2 ? 'めちゃくちゃ長いタイトル' : '短いタイトル';

		tmpMangaData[0].chapters.push({
			id: `en-ch-${i}`,
			title: enTitle,
			pageCount: tmpPageCount,
			pages: enTmpPages,
		});
		tmpMangaData[1].chapters.push({
			id: `jp-ch-${i}`,
			title: jpTitle,
			pageCount: tmpPageCount,
			pages: jpTmpPages,
		});
	}

	return {
		id: 'test-manga',
		publishedDate: '2024-01-16',
		contributors: [
			{
				name: 'Test1',
				role: 'organizer',
				socials: [],
			},
			{
				name: 'Test2',
				role: 'writer',
				socials: [
					{
						platform: 'twitter',
						link: '',
					},
				],
			},
			{
				name: 'Test3',
				role: 'lead-artist',
				socials: [
					{
						platform: 'pixiv',
						link: '',
					},
					{
						platform: 'twitter',
						link: '',
					},
				],
			},
			{
				name: 'Test4a',
				role: 'artist',
				socials: [
					{
						platform: 'pixiv',
						link: '',
					},
					{
						platform: 'twitter',
						link: '',
					},
				],
			},
			{
				name: 'Test4b',
				role: 'artist',
				socials: [
					{
						platform: 'pixiv',
						link: '',
					},
					{
						platform: 'twitter',
						link: '',
					},
				],
			},
			{
				name: 'Test4c',
				role: 'artist',
				socials: [
					{
						platform: 'pixiv',
						link: '',
					},
					{
						platform: 'twitter',
						link: '',
					},
				],
			},
			{
				name: 'Test5',
				role: 'translator',
				socials: [
					{
						platform: 'twitter',
						link: '',
					},
				],
			},
			{
				name: 'Test6',
				role: 'developer',
				socials: [
					{
						platform: 'github',
						link: '',
					},
				],
			},
		],
		data: {
			en: tmpMangaData[0],
			jp: tmpMangaData[1],
		},
		modalData: {
			imageLicenses: [],
			fontLicenses: [],
			data: {
				en: {
					generalGreeting: 'HiRyS! Happy 3rd Anniversary!',
					generalEssay: 'For 3 years, you\'ve given us IRyStocrats countless memories and special moments - from funny moments in streams, beautiful moments in karaokes, to mesmerizing moments in concerts! As always, we want to show our gratitude by gathering IRyStocrats together to participate in fan projects dedicated to you. For this year, we have created something we know that you\'ll truly love. That\'s right! BOYS\' LO- "Bromance" manga! We truly hope that you and the IRyStocrats enjoy these 3 chapters of "bromance"! (PS: Don\'t worry. The manga isn\'t actually BL. You\'re safe to show this on stream xD)',
					storyGreeting: 'Story',
					storyContent: 'Having made a crucial mistake with IRyS, Good GuyRys finds himself trapped in the Backrooms with his fiercest rival, Bad GuyRyS. Together, the two must solve the mystery of their new prison. Could the two of them set aside the passionate flames burning between them, or will they let themselves be forever trapped without Hope.',
					storyImage: '/assets/irysmanga/other/backroom.png',
					storyImageCaption: 'Good and Bad GuyRys last seen in the Backrooms',
					readerGreeting: 'Welcome to the IRyS-Themed Manga Reader!',
					readerIntro: 'In order to show the manga, we built our very own IRyS-themed reader! Here\'s a quick guide to help you get started and make the most of your reading experience.',
				},
				jp: {
					generalGreeting: '三周年おめでたいRyS!',
					generalEssay: '三年間、配信中の面白い場面と、カラオケ中の美しいひと時と、ライブ中の魅力的な光景などなど数えきれないほどの思い出と特別な瞬間が沢山ありましたね！今回も、あなたに感謝の気持ちを伝えるため、IRystocratsが集まって、ファン企画を立ちました。今年は、IRySなら絶対好き！っと確信したモノを作って参りました。そう！B...じゃなくて、「男の友情」の漫画！IRySもIRyStocratsも、このブロマンス漫画を楽しんでいただけると幸いです！（PS：ガチもんのBLじゃないから配信に映しても大丈夫ですよXD）',
					storyGreeting: 'ストーリー',
					storyContent: '大きなミスをおかしてしまったグッドガイリスは彼の一番ライバルであるバッドガイリスとザ・バックルームに囚われました。新たな牢屋の謎を解かなければいけない二人は、果たしてどのような展開が待っているのだろうか。二人の間に感情が芽生えるのか、それとも希望なき牢屋の中に永遠に彷徨うのだろうか。',
					storyImage: '/assets/irysmanga/other/backroom.png',
					storyImageCaption: '(In Japanese) Good and Bad GuyRys last seen in the Backrooms',
					readerGreeting: 'IrySテーマのマンガリーダーへようこそ！',
					readerIntro: 'マンガを表示するために、私たちは独自のIrysテーマのリーダーを作成しました!ここでは、使い始めるための簡単なガイドを提供し、読書体験を最大限に活用する方法をお伝えします。',
				},
			},
		},
	};
}

// https://stackoverflow.com/questions/679915/how-do-i-test-for-an-empty-javascript-object
function objIsEmpty(obj: any): boolean {
	return Object.keys(obj).length === 0;
}

export default function getManga(devProps: { [key: string]: string }): Manga {
	if (
		process.env.NODE_ENV !== 'production'
		&& (!process.env.NEXT_PUBLIC_CMS_URL || objIsEmpty(devProps))
	) {
		return getDummyManga();
	}

	// TODO: Remove this before deploying to prod
	const useDummy = true;
	if (useDummy) {
		return getDummyManga();
	}

	return getMangaFromDevProps(devProps);
}
