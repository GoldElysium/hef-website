import { Manga, MangaData } from './types';

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
		const tmpPageCount = i === 2 ? 9 : 8;
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
			{
				name: 'Test7',
				role: 'special-thanks',
				socials: [],
			},
		],
		data: {
			en: tmpMangaData[0],
			jp: tmpMangaData[1],
		},
		modalData: {
			imageLicenses: [
				{
					imageName: 'The Backrooms',
					licenseName: '',
					licenseUrl: '',
					source: 'https://web.archive.org/web/20030503094137/http://www.hobbytownoshkosh.com:80/revolution%20raceway,%20020903.htm',
					usedLocation: '4',
				},
				{
					imageName: 'The forest image',
					licenseName: "Pixabay's Content License",
					licenseUrl: 'https://pixabay.com/vi/service/license-summary/',
					source: '',
					usedLocation: '41',
				},
				{
					imageName:
                        "Images taken from IRyS' stream 【CARaoke BREAKOUT finale】Valentine's Singing Escapade",
					licenseName: '',
					licenseUrl: '',
					source: 'https://www.youtube.com/watch?v=kGAxmpIGN0c',
					usedLocation: '55',
				},
				{
					imageName: 'The train station image',
					licenseName: "Adobe Stock's Standard License",
					licenseUrl:
                        'https://stock.adobe.com/vn/license-terms#:~:text=Use%20Only%20restrictions.-,Standard%20licenses,%2C%20digital%20documents%2C%20or%20software.',
					source: '',
					usedLocation: '56',
				},
				{
					imageName: 'The train interior image',
					licenseName: "Shutterstock's Standard License",
					licenseUrl:
                        'https://support.shutterstock.com/s/article/Standard-License-vs-Enhanced-License?language=en_US',
					source: '',
					usedLocation: '58',
				},
				{
					imageName: 'The background images',
					licenseName: "Shutterstock's Standard License",
					licenseUrl:
                        'https://support.shutterstock.com/s/article/Standard-License-vs-Enhanced-License?language=en_US',
					source: '',
					usedLocation: '67, 69',
				},
			],
			fontLicenses: [
				{
					fontName: 'Anime Ace 2',
					licenseName: 'Indie Comics Use',
					licenseUrl: 'https://blambot.com/pages/licenses',
					source: 'Blambot',
				},
				{
					fontName: 'BIZ UD 明朝 (Minchou) Medium',
					licenseName: 'SIL Open Font License 1.1',
					licenseUrl: 'https://openfontlicense.org/',
					source: 'タイプバンク (TypeBank), モリサワ (Morisawa)',
				},
			],
			data: {
				en: {
					generalGreeting: 'HiRyS! Happy 3rd Anniversary!',
					generalEssay:
                        "For 3 years, you've given us IRyStocrats countless memories and special moments - from funny moments in streams, beautiful moments in karaokes, to mesmerizing moments in concerts! As always, we want to show our gratitude by gathering IRyStocrats together to participate in fan projects dedicated to you.\n\n For this year, we have created something we know that you'll truly love. That's right! BOYS' LO- \"Bromance\" manga! We truly hope that you and the IRyStocrats enjoy these 3 chapters of \"bromance\"! \n(PS: Don't worry. The manga isn't actually BL. You're safe to show this on stream xD)",
					storyGreeting: 'Story',
					storyContent:
                        'Having made a crucial mistake with IRyS, Good GuyRys finds himself trapped in the Backrooms with his fiercest rival, Bad GuyRyS. Together, the two must solve the mystery of their new prison. Could the two of them set aside the passionate flames burning between them, or will they let themselves be forever trapped without Hope.',
					storyImage: '/assets/irysmanga/other/backroom.png',
					storyImageCaption: 'Good and Bad GuyRys last seen in the Backrooms',
					readerGreeting: 'Welcome to the IRyS-Themed Manga Reader!',
					readerIntro:
                        "In order to show the manga, we built our very own IRyS-themed reader! Here's a quick guide to help you get started and make the most of your reading experience.",
					licensesGreeting: 'Licenses',
					artLicensesContent:
                        "Fan Art Guidelines: The artwork in our manga adheres to Cover's guidelines for fanart. For more details, please refer to the",
					coverGuidelines: "Cover's derivative works guidelines",
					additionalInfoContent:
                        'For any inquiries or further details about the licenses and usage rights, please contact us at [contact information]',
				},
				jp: {
					generalGreeting: '三周年おめでたいRyS!',
					generalEssay:
                        '三年間、配信中の面白い場面と、カラオケ中の美しいひと時と、ライブ中の魅力的な光景などなど数えきれないほどの思い出と特別な瞬間が沢山ありましたね！今回も、あなたに感謝の気持ちを伝えるため、IRyStocratsが集まって、ファン企画を立ちました。今年は、IRySなら絶対好き！っと確信したモノを作って参りました。そう！B...じゃなくて、「男の友情」の漫画！IRySもIRyStocratsも、このブロマンス漫画を楽しんでいただけると幸いです！\n（PS：ガチもんのBLじゃないから配信に映しても大丈夫ですよXD）',
					storyGreeting: 'ストーリー',
					storyContent:
                        '大きなミスをおかしてしまったグッドガイリスは彼の一番ライバルであるバッドガイリスとザ・バックルームに囚われました。新たな牢屋の謎を解かなければいけない二人は、果たしてどのような展開が待っているのだろうか。二人の間に感情が芽生えるのか、それとも希望なき牢屋の中に永遠に彷徨うのだろうか。',
					storyImage: '/assets/irysmanga/other/backroom.png',
					storyImageCaption:
                        'ザ・バックルームで最後に姿を確認できましたグッドガイリスとバッドガイリス',
					readerGreeting: 'IrySテーマのマンガリーダーへようこそ！',
					readerIntro:
                        'マンガを表示するために、私たちは独自のIRySテーマのリーダーを作成しました!ここでは、使い始めるための簡単なガイドを提供し、読書体験を最大限に活用する方法をお伝えします。',
					licensesGreeting: '',
					artLicensesContent: '',
					coverGuidelines: '',
					additionalInfoContent: '',
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
