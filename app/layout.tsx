import '../styles/globals.css';
import '../styles/sana-timeline.css';
import DarkModeContextProvider from './DarkModeContextProvider';
import Navbar from '../ui/Navbar';

export default function RootLayout({ children }: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<head>
				<title>HoloEN Fan Website</title>
			</head>
			<DarkModeContextProvider>
				<Navbar />
				<main>
					{children}
				</main>
			</DarkModeContextProvider>
		</html>
	);
}
