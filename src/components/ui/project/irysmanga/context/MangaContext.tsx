import React, {
	createContext, useState, useContext, useMemo,
} from 'react';
import dummyMangaInfo, { MangaInfo } from '../utils/types';

// Define the type for the context value
interface MangaContextProps {
	isEnglish: boolean;
	setIsEnglish: React.Dispatch<React.SetStateAction<boolean>>;

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

	isLightTheme: boolean;
	setIsLightTheme: React.Dispatch<React.SetStateAction<boolean>>;

	manga: MangaInfo;
	setManga: React.Dispatch<React.SetStateAction<MangaInfo>>;
}

// Creating a context object
const MangaContext = createContext<MangaContextProps | undefined>(undefined);

/* eslint-disable */
// Creating a provider component
export const MangaProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [isEnglish, setIsEnglish] = useState(true);
    const [singlePageMode, setSinglePageMode] = useState(false);
    const [fitHeightMode, setFitHeightMode] = useState(false);

    const [manga, setManga] = useState(dummyMangaInfo);
    const [page, setPage] = useState(0);
    const [chapter, setChapter] = useState(0);
    const [leftToRight, setLeftToRight] = useState(true);
    const [headerHidden, setHeaderHidden] = useState(true);

    const [isLightTheme, setIsLightTheme] = useState(true);

    const contextValue = useMemo(
        () => ({
            isEnglish,
            setIsEnglish,
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
            isLightTheme,
            setIsLightTheme,
            manga,
            setManga,
        }),
        [
            isEnglish,
            page,
            chapter,
            singlePageMode,
            fitHeightMode,
            leftToRight,
            headerHidden,
            isLightTheme,
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
