import Card from 'ui/Card';
import TextHeader from 'ui/TextHeader';
import { Project } from 'types/payload-types';
import PayloadResponse from 'types/PayloadResponse';
import Header from 'ui/Header';
import { Metadata } from 'next';
import useTranslation from 'lib/i18n/server';
import { Language } from 'lib/i18n/languages';

interface IProps {
	params: {
		lang: Language;
	}
}

async function fetchProjects(lang: Language): Promise<Project[]> {
	let moreProjects = true;
	let page = 1;
	let projects: Project[] = [];

	async function fetchNextProjects() {
		// Fetch next page
		const projectsRes = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL!}/api/projects?limit=100&page=${page}&depth=2&locale=${lang}`, {
			headers: {
				'X-RateLimit-Bypass': process.env.PAYLOAD_BYPASS_RATE_LIMIT_KEY ?? '',
			} as Record<string, string>,
		});
		const body: PayloadResponse<Project> = await projectsRes.json();

		projects = projects.concat(body.docs);

		// Set variables for next fetch
		page += 1;
		moreProjects = body.hasNextPage;
	}

	while (moreProjects) {
		// eslint-disable-next-line no-await-in-loop
		await fetchNextProjects();
	}

	return projects;
}

function formatProjects(projects: Project[], lang: Language): JSX.Element[] {
	return projects.map((project: Project) => (
		<Card
			key={project.id}
			title={project.title}
			description={project.shortDescription}
			button="View"
			url={`/projects/${project.slug}`}
			lang={lang}
			internal
		/>
	));
}

export default async function Page({ params: { lang } }: IProps) {
	const { t } = await useTranslation(lang, 'projects', 'page');
	const projects = await fetchProjects(lang);

	const ongoing = projects.filter((project: Project) => project.status === 'ongoing');
	const ongoingProjects = formatProjects(ongoing, lang);

	const past = projects.filter((project: Project) => project.status === 'past');
	const pastProjects = formatProjects(past, lang);

	return (
		<div className="flex flex-col h-full min-h-screen bg-skin-background-1 dark:bg-skin-dark-background-1">
			<Header
				title="Projects"
				description="A list of all the projects organized by Hololive EN Fan servers!"
			/>
			<div className="flex-grow">
				<div className="my-16 w-full flex flex-col items-center">
					<div className="max-w-4xl mx-4">
						<div>
							<TextHeader>{t('ongoing')}</TextHeader>
							<div className="flex flex-col text-center sm:flex-row sm:flex-wrap sm:-mx-2 sm:justify-center">
								{ongoingProjects.length > 0 ? (
									ongoingProjects
								) : (
									<div className="font-bold text-2xl mt-4 text-black dark:text-white">
										{t('none')}
									</div>
								)}
							</div>
						</div>
						<div className="mt-10">
							<TextHeader>{t('past')}</TextHeader>
							<div className="flex flex-col text-center sm:flex-row sm:flex-wrap sm:-mx-2 sm:justify-center">
								{pastProjects.length > 0 ? (
									pastProjects
								) : (
									<div className="font-bold text-2xl mt-4 text-black dark:text-white">
										{t('none')}
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export async function generateMetadata({ params: { lang } }: IProps): Promise<Metadata> {
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const { t } = await useTranslation(lang, 'projects', 'head');

	const title = t('title');
	const description = t('description');

	return {
		title,
		description,
		openGraph: {
			title,
			description,
			images: 'https://holoen.fans/img/logo.png',
			type: 'website',
			siteName: 'HoloEN Fan Website',
		},
		twitter: {
			title,
			description,
			images: 'https://holoen.fans/img/logo.png',
			site: '@HEF_Website',
			card: 'summary_large_image',
		},
	};
}
