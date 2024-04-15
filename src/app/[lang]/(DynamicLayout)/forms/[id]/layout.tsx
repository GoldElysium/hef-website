import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import NoticeBannerWrapper from '@/components/ui/NoticeBannerWrapper';
import { Language } from '@/lib/i18n/languages';
import DarkModeProvider from '@/components/contexts/DarkModeProvider';
import skins from '@/styles/skins.module.css';
import Header from '@/components/ui/Header';
import { fetchForm } from '@/app/[lang]/(DynamicLayout)/forms/[id]/page';

interface IProps {
	children: React.ReactNode;
	params: {
		id: string;
		lang: Language;
	}
}

export default async function RootLayout({ children, params: { id, lang } }: IProps) {
	const form = await fetchForm(id, lang);

	return (
		<body className={form ? skins[form.skin] ?? undefined : undefined}>
			<DarkModeProvider>
				<Navbar
					flags={[]}
					noticeBanner={
						<NoticeBannerWrapper lang={lang} />
					}
					locale={lang}
				/>
				{form && (
					<Header
						title={form.name}
						description={form.description}
						devprops={[]}
					/>
				)}
				<main>
					{children}
				</main>
				<Footer flags={[]} />
			</DarkModeProvider>
		</body>
	);
}
