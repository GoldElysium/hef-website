import Navbar from 'ui/Navbar';
import Footer from 'ui/Footer';

interface IProps {
	children: React.ReactNode;
}

export default function RootLayout({ children }: IProps) {
	return (
		<>
			<Navbar flags={[]} />
			<main>
				{children}
			</main>
			<Footer flags={[]} />
		</>
	);
}
