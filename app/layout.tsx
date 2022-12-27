import 'styles/globals.css';
import DarkModeContextProvider from 'ui/DarkModeContextProvider';

interface IProps {
	children: React.ReactNode;
}

export default async function RootLayout({ children }: IProps) {
	return (
		<html lang="en">
			<DarkModeContextProvider>
				{children}
			</DarkModeContextProvider>
		</html>
	);
}
