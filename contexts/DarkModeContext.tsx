import React from 'react';

const DarkModeContext = React.createContext({
	darkMode: false,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	setDarkMode: (darkMode: boolean) => {},
	saveDarkMode: () => {},
	toggleDarkMode: () => {},
});
export default DarkModeContext;
