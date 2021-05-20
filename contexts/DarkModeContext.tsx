import React from 'react';

const DarkModeContext = React.createContext({
	darkMode: false,
	toggleDarkMode: () => {},
});
export default DarkModeContext;
