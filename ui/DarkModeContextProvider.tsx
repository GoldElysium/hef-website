'use client';

import React, { useEffect, useMemo, useState } from 'react';
import DarkModeContext from 'contexts/DarkModeContext';

export default function DarkModeContextProvider({ children }: { children: React.ReactNode }) {
	const [darkMode, setDarkMode] = useState(false);

	useEffect(() => {
		if (!window) return;

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
		toggleDarkMode: () => {
			setDarkMode(!darkMode);
			window?.localStorage.setItem('darkMode', JSON.stringify(!darkMode));
		},
	}), [darkMode]);

	return (
		<DarkModeContext.Provider value={context}>
			<body className={darkMode ? 'dark' : ''}>
				{children}
			</body>
		</DarkModeContext.Provider>
	);
}
