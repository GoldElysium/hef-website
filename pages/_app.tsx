import '../styles/globals.css';
import { AppProps } from 'next/app';
import { useEffect, useState } from 'react';
import DarkModeContext from '../contexts/DarkModeContext';

function MyApp({ Component, pageProps }: AppProps) {
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

	const context = {
		darkMode,
		toggleDarkMode: () => {
			window.localStorage.setItem('darkMode', JSON.stringify(!darkMode));
			setDarkMode(!darkMode);
		},
	};

	return (
		<DarkModeContext.Provider value={context}>
			<div className={darkMode ? 'dark' : ''}>
				{/* eslint-disable-next-line react/jsx-props-no-spreading */}
				<Component {...pageProps} />
			</div>
		</DarkModeContext.Provider>
	);
}

export default MyApp;
