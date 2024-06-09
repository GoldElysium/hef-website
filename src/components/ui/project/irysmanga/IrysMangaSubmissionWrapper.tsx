import { Project } from '@/types/payload-types';
import { Language } from '@/lib/i18n/languages';
import { Jura } from 'next/font/google';
import { MangaProvider } from './context/MangaContext';
import IrysManga from './IrysManga';
import getManga from './utils/data-helper';
import { getImageUrl } from '../../old/Image';

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
	weight: ['500', '600', '700'],
	subsets: ['latin'],
});

async function fetchOptimizedImageURLs({ project, lang }: IProps) {
	// TODO: Change this to serve the actual manga.
	const manga = getManga(project.devprops);
	const { chapters } = manga.data[lang];

	const optimizedImages = new Map<string, string[]>();

	chapters.forEach((chapter) => {
		optimizedImages.set(
			chapter.title,
			chapter.pages.map((page) => getImageUrl(
				{
					src: page,
					height: 1080,
					quality: 90,
					action: 'resize',
				},
			)),
		);
	});

	return optimizedImages;
}

export default async function IrysMangaSubmissionWrapper({ project, lang }: IProps) {
	const optimizedImages = await fetchOptimizedImageURLs({ project, lang });

	return (
		<div className={jura.className}>
			<MangaProvider devProps={project.devprops} lang={lang} optimizedImages={optimizedImages}>
				<IrysManga />
			</MangaProvider>
		</div>
	);
}
