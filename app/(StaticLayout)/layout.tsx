import Navbar from 'ui/Navbar';
import Footer from 'ui/Footer';

interface IProps {
	children: React.ReactNode;
}

export default function RootLayout({ children }: IProps) {
	return (
		<>
			{/* @ts-ignore */}
			<Navbar flags={[]} />
			<main>
				{children}
			</main>
			{/* @ts-ignore */}
			<Footer flags={[]} />
		</>
	);
}
