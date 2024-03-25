import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import PayloadResponse from '@/types/PayloadResponse';
import type { Form } from '@/types/payload-types';
import NoticeBannerWrapper from '@/components/ui/NoticeBannerWrapper';
import { Language } from '@/lib/i18n/languages';
import DarkModeProvider from '@/components/contexts/DarkModeProvider';
import skins from '@/styles/skins.module.css';

interface IProps {
	children: React.ReactNode;
	params: {
		id: string;
		lang: Language;
	}
}

async function getFormSkin(id: string, lang: Language): Promise<Form['skin']> {
	const res = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL!}/api/forms?where[id][equals]=${id}&depth=0&locale=${lang}&fallback-locale=en`, {
		headers: {
			'X-RateLimit-Bypass': process.env.PAYLOAD_BYPASS_RATE_LIMIT_KEY ?? undefined,
			Authorization: process.env.PAYLOAD_API_KEY ? `users API-Key ${process.env.PAYLOAD_API_KEY}` : undefined,
		} as Record<string, string>,
		next: {
			tags: [id],
		},
	});
	const parsedRes = (await res.json() as PayloadResponse<Form>);
	if (parsedRes.totalDocs === 0) return 'holoEN';

	const form = parsedRes.docs[0];

	return form.skin;
}

export default async function RootLayout({ children, params: { id, lang } }: IProps) {
	const skin = await getFormSkin(id, lang);

	return (
		<body className={skins[skin]}>
			<DarkModeProvider>
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
			</DarkModeProvider>
		</body>
	);
}
