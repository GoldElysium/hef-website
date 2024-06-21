'use client';

import React, {
	createContext, useState, useContext, useMemo, useEffect,
} from 'react';
import {
	FitMode,
	HeaderVisibility,
	Language,
	Manga,
	PageDirection,
	PageLayout,
	ProgressVisibility,
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

	const isLocalStorageReady = () => typeof window !== 'undefined';

	/**
     * Grab settings from localStorage if set.
     */
	function getSettings<T>(key: string, def: T): T {
		// If for some reason local storage isn't available yet, just return the default values.
		if (!isLocalStorageReady()) {
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
	const [manga, setManga] = useState(getManga(devProps));
	const [page, setPage] = useState(0);
	const [chapter, setChapter] = useState(0);

	// State to check for first time visits
	const [hasVisited, setHasVisited] = useState<boolean>(getSettings('localHasVisited', false));

	// Define a callback to update localStorage when updating certain parts of state.
	useEffect(() => {
		// If for some reason local storage isn't available yet, don't try to write to it.
		if (isLocalStorageReady()) {
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
