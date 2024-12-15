'use client';

import { createContext } from 'react';

export interface Colors {
	background: number;
	primary: number;
	primaryForeground: number;
	secondary: number;
	secondaryForeground: number;
	secondaryHeading: number;
	text: number;
	header: number;
	headerForeground: number;
	heading: number;
	link: number;
}

export interface IThemeContext {
	colors: {
		light: Colors;
		dark: Colors;
	}
	resolvedTheme: 'light' | 'dark';
}

const defaultColors: Colors = {
	background: 0x000000,
	primary: 0x000000,
	primaryForeground: 0x000000,
	secondary: 0x000000,
	secondaryForeground: 0x000000,
	secondaryHeading: 0x000000,
	text: 0x000000,
	header: 0x000000,
	headerForeground: 0x000000,
	heading: 0x000000,
	link: 0x000000,
};

const ThemeContext = createContext<IThemeContext>({
	colors: {
		light: defaultColors,
		dark: defaultColors,
	},
	resolvedTheme: 'light',
});
export default ThemeContext;
