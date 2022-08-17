import '../styles/globals.css';
import '../styles/sana-timeline.css';
import { AppProps } from 'next/app';
import { useEffect, useMemo, useState } from 'react';
import { SessionProvider } from 'next-auth/react';
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

	const context = useMemo(() => ({
		darkMode,
		setDarkMode,
		saveDarkMode: () => window.localStorage.setItem('darkMode', JSON.stringify(darkMode)),
		toggleDarkMode: () => setDarkMode(!darkMode),
	}), [darkMode]);

	return (
		<DarkModeContext.Provider value={context}>
			<SessionProvider>
				<div className={darkMode ? 'dark' : ''}>
					{/* eslint-disable-next-line react/jsx-props-no-spreading */}
					<Component {...pageProps} />
				</div>
			</SessionProvider>
		</DarkModeContext.Provider>
	);
}

export default MyApp;
