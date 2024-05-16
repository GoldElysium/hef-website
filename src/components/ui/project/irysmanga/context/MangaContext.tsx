import React, {
	createContext, useState, useContext, useMemo,
} from 'react';
import { Manga, generateDummyManga } from '../utils/types';

// Define the type for the context value
interface MangaContextProps {
	language: 'en' | 'jp';
	setLanguage: React.Dispatch<React.SetStateAction<'en' | 'jp'>>;

	page: number;
	setPage: React.Dispatch<React.SetStateAction<number>>;
	chapter: number;
	setChapter: React.Dispatch<React.SetStateAction<number>>;

	singlePageMode: boolean;
	setSinglePageMode: React.Dispatch<React.SetStateAction<boolean>>;
	fitHeightMode: boolean;
	setFitHeightMode: React.Dispatch<React.SetStateAction<boolean>>;
	leftToRight: boolean;
	setLeftToRight: React.Dispatch<React.SetStateAction<boolean>>;
	headerHidden: boolean;
	setHeaderHidden: React.Dispatch<React.SetStateAction<boolean>>;

	readerTheme: string;
	setReaderTheme: React.Dispatch<React.SetStateAction<string>>;

	manga: Manga;
	setManga: React.Dispatch<React.SetStateAction<Manga>>;
}

// Creating a context object
const MangaContext = createContext<MangaContextProps | undefined>(undefined);

/* eslint-disable */
// Creating a provider component
export const MangaProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [language, setLanguage] = useState("en" as "en" | "jp");
    const [singlePageMode, setSinglePageMode] = useState(false);
    const [fitHeightMode, setFitHeightMode] = useState(false);

    const [manga, setManga] = useState(generateDummyManga());
    const [page, setPage] = useState(0);
    const [chapter, setChapter] = useState(0);
    const [leftToRight, setLeftToRight] = useState(true);
    const [headerHidden, setHeaderHidden] = useState(true);

    const [readerTheme, setReaderTheme] = useState("dark");

    const contextValue = useMemo(
        () => ({
            language,
            setLanguage,
            page,
            setPage,
            chapter,
            setChapter,
            singlePageMode,
            setSinglePageMode,
            fitHeightMode,
            setFitHeightMode,
            leftToRight,
            setLeftToRight,
            headerHidden,
            setHeaderHidden,
            readerTheme,
            setReaderTheme,
            manga,
            setManga,
        }),
        [
            language,
            page,
            chapter,
            singlePageMode,
            fitHeightMode,
            leftToRight,
            headerHidden,
            readerTheme,
            manga,
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
