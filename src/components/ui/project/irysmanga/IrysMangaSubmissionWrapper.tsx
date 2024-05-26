'use client';

import { Project } from '@/types/payload-types';
import { Language } from '@/lib/i18n/languages';
import { Jura } from 'next/font/google';
import { MangaProvider } from './context/MangaContext';
import IrysManga from './IrysManga';

interface IProps {
	project: Omit<Project, 'flags' | 'devprops'> & {
		flags: string[];
		devprops: {
			[key: string]: string;
		};
	};
	lang: Language;
}

const jura = Jura({
	weight: ['700'],
	subsets: ['latin'],
});

export default function IrysMangaSubmissionWrapper({ project, lang }: IProps) {
	return (
		<div className={jura.className}>
			<MangaProvider devProps={project.devprops} lang={lang}>
				<IrysManga />
			</MangaProvider>
		</div>
	);
}
