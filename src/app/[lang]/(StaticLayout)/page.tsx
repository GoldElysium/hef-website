import { Language } from 'lib/i18n/languages';
import useTranslation from 'lib/i18n/server';
import { Guild, Media, Project } from 'types/payload-types';
import PayloadResponse from 'types/PayloadResponse';
import Card from 'components/ui/old/Card';
import Header from 'components/ui/Header';
import TextHeader from 'components/ui/old/TextHeader';

interface IProps {
	params: {
		lang: Language;
	}
}

interface PageData {
	featuredProjects: Project[]
	guilds: Array<Omit<Guild, 'icon'> & { icon: Media }>
}

async function fetchData(lang: Language) {
	interface FeaturedProjectsResponse {
		projects: Project[];
		globalType: string;
		createdAt: string;
		updatedAt: string;
		id: string;
	}

	const res = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL!}/api/globals/featured-projects?depth=3&locale=${lang}&fallback-locale=en`, {
		headers: {
			'X-RateLimit-Bypass': process.env.PAYLOAD_BYPASS_RATE_LIMIT_KEY ?? undefined,
			Authorization: process.env.PAYLOAD_API_KEY ? `users API-Key ${process.env.PAYLOAD_API_KEY}` : undefined,
		} as Record<string, string>,
		next: {
			tags: ['featuredProjects'],
		},
	});
	const projects: FeaturedProjectsResponse = await res.json();

	let moreGuilds = true;
	let page = 1;
	let guilds: Guild[] = [];

	async function fetchNextGuilds() {
		// Fetch next page
		const guildsRes = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL!}/api/guilds?limit=100&page=${page}&depth=5&locale=${lang}&fallback-locale=en`, {
			headers: {
				'X-RateLimit-Bypass': process.env.PAYLOAD_BYPASS_RATE_LIMIT_KEY ?? undefined,
				Authorization: process.env.PAYLOAD_API_KEY ? `users API-Key ${process.env.PAYLOAD_API_KEY}` : undefined,
			} as Record<string, string>,
			next: {
				tags: ['guilds'],
			},
		});
		const body: PayloadResponse<Guild> = await guildsRes.json();

		guilds = guilds.concat(body.docs);

		// Set variables for next fetch
		page += 1;
		moreGuilds = body.hasNextPage;
	}

	while (moreGuilds) {
		// eslint-disable-next-line no-await-in-loop
		await fetchNextGuilds();
	}

	return {
		featuredProjects: projects.projects,
		guilds,
	} as PageData;
}

export default async function Page({ params: { lang } }: IProps) {
	const { t } = await useTranslation(lang, 'home');
	const { featuredProjects, guilds } = await fetchData(lang);

	const featuredProjectsHtml = featuredProjects
		.map((project) => (
			<Card
				key={`proj-${project.id}`}
				title={project.title}
				description={project.shortDescription}
				button="View"
				url={`/projects/${project.slug}`}
				lang={lang}
				internal
			/>
		));

	const guildHtml = guilds.map((guild) => (
		<Card
			key={`guild-${guild.id}`}
			img={guild.icon.url}
			title={guild.name}
			description={guild.description}
			button="Join!"
			url={`https://discord.gg/${guild.invite}`}
			lang={lang}
		/>
	));

	return (
		<div className="flex h-full min-h-screen flex-col bg-skin-background text-skin-text dark:bg-skin-background-dark dark:text-skin-text-dark">
			<Header title={t('hero.title')} description={t('hero.description')} />
			<div className="grow">
				<div className="my-16 flex w-full flex-col items-center">
					<div className="mx-4 max-w-4xl sm:mx-0">
						<div>
							<TextHeader>{t('page.featured')}</TextHeader>
							<div className="flex flex-col text-center sm:-mx-2 sm:flex-row sm:flex-wrap sm:justify-center">
								{featuredProjectsHtml.length > 0 ? (
									featuredProjectsHtml
								) : (
									<div className="mt-4 text-2xl font-bold text-black dark:text-white">
										{t('page.none')}
									</div>
								)}
							</div>
						</div>
						<div className="mt-10">
							<TextHeader>{t('page.servers')}</TextHeader>
							<div className="flex flex-col text-center sm:-mx-2 sm:flex-row sm:flex-wrap sm:justify-center">
								{guildHtml.length > 0 ? (
									guildHtml
								) : (
									<div className="mt-4 text-2xl font-bold text-black dark:text-white">
										{t('page.none')}
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
