'use client';

import React, {
	createContext, useState, useContext, useMemo, useEffect,
} from 'react';
import { useRouter } from 'next/navigation';
import {
	FitMode,
	HeaderVisibility,
	Language,
	Manga,
	PageDirection,
	PageLayout,
	ProgressVisibility,
	getMangaDataOrThrow,
} from '../utils/types';
import getManga from '../utils/data-helper';

// Define the type for the context value
interface MangaContextProps {
	readerLanguage: Language;
	setReaderLanguage: React.Dispatch<React.SetStateAction<Language>>;

	mangaLanguage: Language;
	setMangaLanguage: React.Dispatch<React.SetStateAction<Language>>;

	page: number;
	setPage: React.Dispatch<React.SetStateAction<number>>;

	chapter: number;
	setChapter: React.Dispatch<React.SetStateAction<number>>;

	pageLayout: PageLayout;
	setPageLayout: React.Dispatch<React.SetStateAction<PageLayout>>;

	fitMode: FitMode;
	setFitMode: React.Dispatch<React.SetStateAction<FitMode>>;

	direction: PageDirection;
	setDirection: React.Dispatch<React.SetStateAction<PageDirection>>;

	headerVisibility: HeaderVisibility;
	setHeaderVisibility: React.Dispatch<React.SetStateAction<HeaderVisibility>>;

	progressVisibility: ProgressVisibility;
	setProgressVisibility: React.Dispatch<React.SetStateAction<ProgressVisibility>>;

	manga: Manga;
	setManga: React.Dispatch<React.SetStateAction<Manga>>;

	optimizedImages: Map<string, string[]>;

	hasVisited: boolean;
	setHasVisited: React.Dispatch<React.SetStateAction<boolean>>;
}

// Creating a context object
const MangaContext = createContext<MangaContextProps | undefined>(undefined);

interface MangaProviderProps {
	children: React.ReactNode;
	devProps: { [key: string]: string };
	lang: Language;
	optimizedImages: Map<string, string[]>;
}

// Creating a provider component
export function MangaProvider({
	children, devProps, lang, optimizedImages,
}: MangaProviderProps) {
	const localStorageSettingsKey = 'irys-manga-settings';
	let parsedSettings: any = null; // Avoid having to re-parse the json multiple times.

	const isBrowserWindowReady = () => typeof window !== 'undefined';

	/**
     * Grab settings from localStorage if set.
     */
	function getSettings<T>(key: string, def: T): T {
		// If for some reason local storage isn't available yet, just return the default values.
		if (!isBrowserWindowReady()) {
			return def;
		}

		const irysMangaLocalStorage = localStorage.getItem(localStorageSettingsKey);
		if (irysMangaLocalStorage === null) {
			return def;
		}

		if (parsedSettings === null) {
			parsedSettings = JSON.parse(irysMangaLocalStorage);
		}

		const setting: T = parsedSettings[key];
		if (setting === null) {
			return def;
		}

		return setting;
	}

	// Reader settings
	const [readerLanguage, setReaderLanguage] = useState<Language>(
		getSettings('localReaderLanguage', lang),
	);
	const [mangaLanguage, setMangaLanguage] = useState<Language>(
		getSettings('localMangaLanguage', lang),
	);
	const [pageLayout, setPageLayout] = useState<PageLayout>(
		getSettings('localPageLayout', 'single'),
	);
	const [fitMode, setFitMode] = useState<FitMode>(getSettings('localFitMode', 'original'));
	const [direction, setDirection] = useState<PageDirection>(getSettings('localDirection', 'ltr'));
	const [headerVisibility, setHeaderVisibility] = useState<HeaderVisibility>(
		getSettings('localHeaderVisibility', 'header-shown'),
	);
	const [progressVisibility, setProgressVisibility] = useState<ProgressVisibility>(
		getSettings('localProgressVisibility', 'progress-shown'),
	);

	// Manga details
	const [manga, setManga] = useState<Manga>(getManga(devProps));

	// Fetch the page/chapter from the URL, else use the default value of 0.
	function getPageAndChapterFromHash() : number[] {
		if (isBrowserWindowReady()) {
			const { hash } = window.location;
			const parts = hash.split('/');

			const result = [0, 0];
			if (parts.length === 2) {
				const chapter = parseInt(parts[0].substring(1), 10);
				const page = parseInt(parts[1], 10);

				result[0] = Number.isNaN(chapter) ? result[0] : chapter;
				result[1] = Number.isNaN(page) ? result[1] : page;

				const mangaData = getMangaDataOrThrow(manga, mangaLanguage);
				result[0] = result[0] >= mangaData.chapterCount ? 0 : result[0];
				result[1] = result[1] >= mangaData.chapters[result[0]].pageCount ? 0 : result[1];
			}

			return result;
		}
		return [0, 0];
	}

	const [hashChapter, hashPage] = getPageAndChapterFromHash();
	const [page, setPage] = useState<number>(hashPage);
	const [chapter, setChapter] = useState<number>(hashChapter);

	// State to check for first time visits
	const [hasVisited, setHasVisited] = useState<boolean>(getSettings('localHasVisited', false));

	// Define a callback to update localStorage when updating certain parts of state.
	useEffect(() => {
		// If for some reason local storage isn't available yet, don't try to write to it.
		if (isBrowserWindowReady()) {
			const settings = {
				localReaderLanguage: readerLanguage,
				localMangaLanguage: mangaLanguage,
				localPageLayout: pageLayout,
				localFitMode: fitMode,
				localDirection: direction,
				localHeaderVisibility: headerVisibility,
				localProgressVisibility: progressVisibility,
				localHasVisited: hasVisited,
			};

			localStorage.setItem(localStorageSettingsKey, JSON.stringify(settings));
		}
	}, [
		readerLanguage,
		mangaLanguage,
		pageLayout,
		fitMode,
		direction,
		headerVisibility,
		progressVisibility,
		hasVisited,
	]);

	const router = useRouter();
	// When the page/chapter is changed, push the new value into the URL.
	// Wrapped in useEffect to ensure that it only runs when page or chapter is updated.
	// Also helps silence some spurious errors.
	useEffect(() => {
		router.replace(`#${chapter}/${page}`);
	}, [page, chapter, router]);

	const contextValue = useMemo(
		() => ({
			readerLanguage,
			setReaderLanguage,
			mangaLanguage,
			setMangaLanguage,
			page,
			setPage,
			chapter,
			setChapter,
			pageLayout,
			setPageLayout,
			fitMode,
			setFitMode,
			direction,
			setDirection,
			headerVisibility,
			setHeaderVisibility,
			progressVisibility,
			setProgressVisibility,
			manga,
			setManga,
			optimizedImages,
			hasVisited,
			setHasVisited,
		}),
		[
			readerLanguage,
			mangaLanguage,
			page,
			chapter,
			pageLayout,
			fitMode,
			direction,
			headerVisibility,
			progressVisibility,
			manga,
			optimizedImages,
			hasVisited,
		],
	);

	return <MangaContext.Provider value={contextValue}>{children}</MangaContext.Provider>;
}

/**
 * Custom hook to use the context
 */
export const useMangaContext = (): MangaContextProps => {
	const context = useContext(MangaContext);
	if (!context) {
		throw new Error('useMangaContext must be used within an MangaProvider');
	}
	return context;
};
