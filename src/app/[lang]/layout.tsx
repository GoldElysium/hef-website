import '@/styles/globals.css';
import type { Metadata } from 'next';
import { dir } from 'i18next';
import LocaleContextProvider from '@/components/contexts/LocaleContextProvider';
import useTranslation from '@/lib/i18n/server';
import { Language } from '@/lib/i18n/languages';
import { languages } from '@/lib/i18n/settings';
import { Nunito } from 'next/font/google';

interface IProps {
	children: React.ReactNode;
	params: {
		lang: Language;
	}
}

const nunito = Nunito({
	variable: '--font-nunito',
	subsets: ['latin'],
});

export default async function RootLayout({
	children,
	params: {
		lang,
	},
}: IProps) {
	return (
		<html lang={lang} dir={dir(lang)} className={nunito.variable} suppressHydrationWarning>
			<head>
				<link href="/favicon.svg" rel="icon" type="image/svg+xml" />
			</head>
			<LocaleContextProvider lang={lang}>
				{children}
			</LocaleContextProvider>
		</html>
	);
}

export async function generateStaticParams() {
	return languages.map((language) => ({ lang: language }));
}

export async function generateMetadata({ params: { lang } }: IProps): Promise<Metadata> {
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const { t } = await useTranslation(lang, 'layout', 'head');

	const title = t('title');
	const description = t('description');

	return {
		title,
		description,
		alternates: {
			canonical: '/',
			languages: {
				en: '/en',
				ja: '/jp',
			},
		},
		keywords: ['hololive en', 'hef', 'hololive fan', 'hololive en fan', 'hololive'],
		themeColor: '#FF3D3D',
		openGraph: {
			title,
			description,
			images: 'https://holoen.fans/img/icon_bg.png',
			type: 'website',
			siteName: title,
		},
		twitter: {
			title,
			description,
			images: 'https://holoen.fans/img/icon_bg.png',
			site: '@HEF_Website',
			card: 'summary_large_image',
		},
		other: {
			subject: title,
			language: lang.toUpperCase(),
			url: 'https://holoen.fans',
		},
	};
}
