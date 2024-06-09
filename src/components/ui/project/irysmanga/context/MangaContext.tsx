'use client';

import React, {
	createContext, useState, useContext, useMemo,
} from 'react';
import {
	FitMode,
	HeaderVisibility,
	Language,
	Manga,
	PageDirection,
	PageLayout,
	ProgressVisibility,
	ReaderTheme,
	readerThemes,
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

	readerTheme: ReaderTheme;
	setReaderTheme: React.Dispatch<React.SetStateAction<ReaderTheme>>;

	manga: Manga;
	setManga: React.Dispatch<React.SetStateAction<Manga>>;

	optimizedImages: Map<string, string[]>
}

// Creating a context object
const MangaContext = createContext<MangaContextProps | undefined>(undefined);

/* eslint-disable */
// Creating a provider component
export const MangaProvider: React.FC<{ children: React.ReactNode, devProps: { [key: string]: string }, lang: Language, optimizedImages: Map<string, string[]> }> = (
	{ children, devProps, lang, optimizedImages }) => {
	const [readerLanguage, setReaderLanguage] = useState<Language>(lang);
	const [mangaLanguage, setMangaLanguage] = useState<Language>(lang);
	const [pageLayout, setPageLayout] = useState<PageLayout>("single");
	const [fitMode, setFitMode] = useState<FitMode>("original");

	const [manga, setManga] = useState(getManga(devProps));
	const [page, setPage] = useState(0);
	const [chapter, setChapter] = useState(0);
	const [direction, setDirection] = useState<PageDirection>("ltr");
	const [headerVisibility, setHeaderVisibility] =
		useState<HeaderVisibility>("header-shown");
	const [progressVisibility, setProgressVisibility] =
		useState<ProgressVisibility>("progress-shown");

	const [readerTheme, setReaderTheme] = useState<ReaderTheme>(readerThemes[0]);

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
			readerTheme,
			setReaderTheme,
			manga,
			setManga,
			optimizedImages,
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
			readerTheme,
			manga,
			optimizedImages,
		]
	);

	return (
		<MangaContext.Provider value={contextValue}>
			{children}
		</MangaContext.Provider>
	);
};
// eslint-enable

// Custom hook to use the context
export const useMangaContext = (): MangaContextProps => {
	const context = useContext(MangaContext);
	if (!context) {
		throw new Error("useMangaContext must be used within an MangaProvider");
	}
	return context;
};
