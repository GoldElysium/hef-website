export type Chapter = {
	id: string;
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
	role: 'organizer' | 'writer' | 'lead-artist' | 'artist' | 'translator' | 'developer';
	socials: {
		platform: string;
		link: string;
	}[];
};

export type ModalData = {
	generalGreeting: string;
	generalEssay: string;
	storyGreeting: string;
	storyContent: string;
	storyImage: string;
	storyImageCaption: string;
	readerGreeting: string;
	readerIntro: string;
};

export type ModalDataRoot = {
	data: { readonly [lang: string]: ModalData }; // Maps ISO language codes to correct data.
	fontLicenses: {
		fontName: string;
		licenseName: string;
		licenseUrl: string;
		source: string;
	}[];
	imageLicenses: {
		imageName: string;
		licenseName: string;
		licenseUrl: string;
		source: string;
		usedLocation: string; // the page number(s) where the image was used.
	}[];
};

export type Manga = {
	id: string;
	publishedDate: string; // Publish date must be in ISO8601
	contributors: Contributor[];
	data: { readonly [lang: string]: MangaData }; // Maps ISO language codes to correct data.
	modalData: ModalDataRoot;
};

// Reader settings types
export const fitModes = ['height', 'width', 'original', 'fit-both'] as const;
export type FitMode = (typeof fitModes)[number];

export const languages = ['en', 'jp'] as const;
export type Language = (typeof languages)[number];

export const pageLayouts = ['ltr', 'rtl', 'long'] as const;
export type PageLayout = (typeof pageLayouts)[number];

export const headerVisibilities = ['header-hidden', 'header-shown'] as const;
export type HeaderVisibility = (typeof headerVisibilities)[number];

export const progressVisibilities = ['progress-hidden', 'progress-shown'] as const;
export type ProgressVisibility = (typeof progressVisibilities)[number];

export const readerThemes = ['light', 'dark'] as const;
export type ReaderTheme = (typeof readerThemes)[number];

export type ReaderSetting =
    | FitMode
    | Language
    | PageLayout
    | HeaderVisibility
    | ReaderTheme
    | ProgressVisibility;

export function getLocalisedModalData(modalDataRoot: ModalDataRoot, language: string): ModalData {
	if (modalDataRoot === undefined || modalDataRoot === null) {
		throw new Error('manga object is undefined/null.');
	}

	const modalData = modalDataRoot.data[language];
	if (modalData === undefined) {
		throw new RangeError(`No modal data for language "${language}".`);
	}

	return modalData;
}

export function getModalDataRoot(manga: Manga): ModalDataRoot {
	if (manga === undefined || manga === null) {
		throw new Error('manga object is undefined/null.');
	}

	const modalDataRoot = manga.modalData;
	if (modalDataRoot === undefined) {
		throw new RangeError('No modal data in Manga object.');
	}

	return modalDataRoot;
}

// Returns the correct MangaData object for a given language. If there is no such manga data
// for the given language, throw an error.
export function getMangaDataOrThrow(manga: Manga, language: string): MangaData {
	if (manga === undefined || manga === null) {
		throw new Error('manga object is undefined/null.');
	}

	const mangaData = manga.data[language];
	if (mangaData === undefined) {
		throw new RangeError(`No manga data for language "${language}".`);
	}

	return mangaData;
}
