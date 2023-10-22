import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import NoticeBannerWrapper from '@/components/ui/NoticeBannerWrapper';
import { Language } from '@/lib/i18n/languages';

interface IProps {
	children: React.ReactNode;
	params: {
		lang: Language;
	}
}

export default function RootLayout({ children, params: { lang } }: IProps) {
	return (
		<>
			<Navbar
				flags={[]}
				noticeBanner={
					<NoticeBannerWrapper lang={lang} />
				}
				locale={lang}
			/>
			<main>
				{children}
			</main>
			<Footer flags={[]} />
		</>
	);
}
