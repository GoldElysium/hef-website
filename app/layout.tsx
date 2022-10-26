'use client';

import '../styles/globals.css';
import '../styles/sana-timeline.css';

import { useEffect, useMemo, useState } from 'react';
import DarkModeContext from '../contexts/DarkModeContext';

export default function RootLayout({ children }: {
	children: React.ReactNode;
}) {
	const [darkMode, setDarkMode] = useState(false);

	useEffect(() => {
		const savedDarkMode = window.localStorage.getItem('darkMode');
		if (savedDarkMode !== null) {
			setDarkMode(JSON.parse(savedDarkMode));
			return;
		}
		if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
			setDarkMode(true);
		}
	}, []);

	const context = useMemo(() => ({
		darkMode,
		setDarkMode,
		saveDarkMode: () => window.localStorage.setItem('darkMode', JSON.stringify(darkMode)),
		toggleDarkMode: () => setDarkMode(!darkMode),
	}), [darkMode]);

	return (
		<html lang="en">
			<head>
				<title>HoloEN Fan Website</title>
			</head>
			<DarkModeContext.Provider value={context}>
				<body className={darkMode ? 'dark' : ''}>
					{children}
				</body>
			</DarkModeContext.Provider>
		</html>
	);
}
