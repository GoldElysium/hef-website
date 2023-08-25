import Navbar from 'components/ui/Navbar';
import Footer from 'components/ui/Footer';

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
