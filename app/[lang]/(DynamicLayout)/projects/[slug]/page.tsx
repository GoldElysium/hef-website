import {
	Flag, Guild, Media, Project,
} from 'types/payload-types';
import DescriptionSerializer from 'ui/DescriptionSerializer';
import TextHeader from 'ui/TextHeader';
import PayloadResponse from 'types/PayloadResponse';
import Submissions from 'ui/project/Submissions';
import Gallery from 'ui/project/Gallery';
import ExperimentalProjectPage from 'ui/project/experimental/sana/Page';
import PhaserSubmissionWrapper from 'ui/project/guratanabata/PhaserSubmissionWrapper';
import { notFound } from 'next/navigation';
import { getImageUrl } from 'ui/Image';
import { Metadata } from 'next';
import useTranslation from 'lib/i18n/server';
import { Language } from 'lib/i18n/languages';

// ID's for both production and development databases
// TODO: Replace with Payload data
const ID_TO_STYLE_MAP = new Map<string, string>();
ID_TO_STYLE_MAP.set('62c16ca2b919eb349a6b09ba', 'theme-ina');

// Development testing ID's
ID_TO_STYLE_MAP.set('62c9442ff1ee39aa37afc4c7', 'theme-ina');
ID_TO_STYLE_MAP.set('63209a0af2be5d1c9590fb62', 'theme-sana');

interface IProps {
	params: {
		slug: string;
		lang: Language;
	}
}

interface ProjectData {
	project: Omit<Project, 'flags' | 'devprops'> & {
		flags: string[];
		devprops: {
			[key: string]: string;
		};
	};
}

async function fetchProject(slug: string, lang: Language): Promise<ProjectData | null> {
	// Fetch locale for the page, CMS will fallback to EN for any fields not translated
	const projectRes = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL!}/api/projects?where[slug][like]=${slug}&depth=2&locale=${lang}`, {
		headers: {
			'X-RateLimit-Bypass': process.env.PAYLOAD_BYPASS_RATE_LIMIT_KEY ?? '',
		} as Record<string, string>,
	});

	const res = (await projectRes.json() as PayloadResponse<Project>);
	if (res.totalDocs === 0) return null;

	const project = res.docs[0];
	const flags = (project.flags as Flag[] | undefined ?? []).map((flag) => flag.code);

	return {
		project: {
			...project,
			media: project.media.map((item) => {
				if (!item.media) return item;

				return {
					...item,
					media: {
						...item.media as Media,
						url: getImageUrl({ src: (item.media as Media).url!, width: 1024 }),
					} as Media,
				};
			}),
			flags,
			// eslint-disable-next-line max-len
			devprops: project.devprops ? project.devprops.reduce((a, v) => ({ ...a, [v.key]: v.value }), {}) : {},
		},
	};
}

// eslint-disable-next-line max-len
export default async function ProjectPage({ params: { slug, lang } }: IProps) {
	const res = await fetchProject(slug, lang);
	if (res === null) {
		notFound();
	}

	const { project } = res;
	// const ref = useMemo(() => createRef<BlurBackground>(), []);

	const themeStyle = ID_TO_STYLE_MAP.get((project.organizer as Guild).id);

	if (project.flags?.includes('experimental')) {
		return (
		/* @ts-expect-error https://github.com/vercel/next.js/issues/42292 */
			<ExperimentalProjectPage project={project} />
		);
	}

	if (project.flags?.includes('guratanabata')) {
		return (
		/* @ts-expect-error https://github.com/vercel/next.js/issues/42292 */
			<PhaserSubmissionWrapper project={project} />
		);
	}

	const { t } = await useTranslation(lang, 'project', 'page');

	return (
		<div className={themeStyle}>
			<div className="flex flex-col h-full min-h-screen bg-skin-background-1 dark:bg-skin-dark-background-1">
				<div className="flex-grow">
					<div className="mb-16 mt-4 w-full flex flex-col items-center">
						<div className="max-w-full w-full sm:!max-w-4xl px-4 break-words md:break-normal">
							<div className="description-body">
								{DescriptionSerializer(project.description)}
							</div>
							{(project.media?.length ?? 0) > 0 && (
								<Gallery project={project as any} />
							)}
							{(project.links?.length ?? 0) > 0 && (
								<div className="mt-4">
									<TextHeader>
										{t('links')}
									</TextHeader>
									<div className="flex justify-center space-x-6 px-4 sm:px-0">
										{project.links && project.links.map((link) => (
											<div
												key={`link-${link.name}-${link.url}`}
												className="rounded-3xl font-bold w-[6rem] h-10 flex items-center justify-center mt-4 content-end bg-skin-secondary-1 dark:bg-skin-dark-secondary-1 text-white hover:text-opacity-70"
											>
												<a href={link.url} target="_blank" rel="noreferrer">
													{link.name}
												</a>
											</div>
										))}
									</div>
								</div>
							)}
							{/* TODO: Move submissions to separate tab */}
							<div className="mt-4">
								{!(project.flags.includes('disableTabs') || project.flags.includes('filterableSubmissions')) && (
									<TextHeader>Submissions</TextHeader>
								)}
								{/* @ts-expect-error */}
								<Submissions project={project} lang={lang} />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export async function generateStaticParams({ params: { lang } }: IProps) {
	let projects: Project[] = [];
	let moreProjects = true;
	let page = 1;

	async function fetchNextProjects() {
		// Fetch next page
		const projectsRes = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL!}/api/projects?depth=0&limit=100&page=${page}&depth=0&locale=${lang}`, {
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

	return projects.map((project) => (
		{
			slug: project.slug,
		}
	));
}

export async function generateMetadata({ params: { slug, lang } }: IProps): Promise<Metadata> {
	const projectRes = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL!}/api/projects?where[slug][like]=${slug}&depth=2&locale=${lang}`, {
		headers: {
			'X-RateLimit-Bypass': process.env.PAYLOAD_BYPASS_RATE_LIMIT_KEY ?? '',
		} as Record<string, string>,
	});
	const parsedProjectRes = (await projectRes.json() as PayloadResponse<Project>);
	if (parsedProjectRes.totalDocs === 0) return notFound();

	const {
		title, shortDescription, ogImage, image,
	} = parsedProjectRes.docs[0];

	return {
		title,
		description: shortDescription,
		openGraph: {
			title,
			description: shortDescription,
			siteName: 'HoloEN Fan Website',
		},
		twitter: {
			title,
			description: shortDescription,
			// eslint-disable-next-line max-len
			images: getImageUrl({ src: (ogImage as Media | undefined)?.url ?? (image as Media).url!, width: 1024 }),
			site: '@HEF_Website',
			creator: '@GoldElysium',
			card: 'summary_large_image',
		},
	};
}
