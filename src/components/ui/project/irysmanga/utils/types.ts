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
	role: 'organizer' | 'writer' | 'lead-artist' | 'artist' | 'translator' | 'developer' | 'special-thanks';
	socials: {
		platform: string;
		link: string;
	}[];
};

export type Manga = {
	id: string;
	publishedDate: string; // Publish date must be in ISO8601
	contributors: Contributor[];
	data: { readonly [lang: string]: MangaData }; // Maps ISO language codes to correct data.
};

// Reader settings types
export const fitModes = ['height', 'width', 'original'] as const;
export type FitMode = (typeof fitModes)[number];

export const languages = ['en', 'jp'] as const;
export type Language = (typeof languages)[number];

export const pageLayouts = ['single', 'long'] as const;
export type PageLayout = (typeof pageLayouts)[number];

export const directions = ['ltr', 'rtl'] as const;
export type PageDirection = (typeof directions)[number];

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
    | PageDirection
    | HeaderVisibility
    | ReaderTheme
    | ProgressVisibility;

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
