import 'styles/globals.css';
import 'styles/sana-timeline.css';
import Navbar from 'ui/Navbar';
import DarkModeContextProvider from 'ui/DarkModeContextProvider';
import Footer from 'ui/Footer';

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<DarkModeContextProvider>
				{/* @ts-ignore */}
				<Navbar />
				<main>
					{children}
				</main>
				{/* @ts-ignore */}
				<Footer />
			</DarkModeContextProvider>
		</html>
	);
}
