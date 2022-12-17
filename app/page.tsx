import { Guild, Media, Project } from '../types/payload-types';
import PayloadResponse from '../types/PayloadResponse';
import Card from '../ui/Card';
import Hero from '../ui/Hero';
import TextHeader from '../ui/TextHeader';

interface PageData {
	featuredProjects: {
		en: Project[];
		jp: {
			title: Project['title'];
			shortDescription: Project['shortDescription'];
			description: Project['description'];
		}[];
	};
	guilds: {
		en: Array<Omit<Guild, 'icon'> & { icon: Media }>;
		jp: {
			description: Guild['description'];
		}[];
	};
}

async function fetchData() {
	interface FeaturedProjectsResponse {
		projects: Project[];
		globalType: string;
		createdAt: string;
		updatedAt: string;
		id: string;
	}

	const enRes = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL!}/api/globals/featured-projects?depth=3`, {
		headers: {
			'X-RateLimit-Bypass': process.env.PAYLOAD_BYPASS_RATE_LIMIT_KEY ?? '',
		} as Record<string, string>,
	});
	const enProjects: FeaturedProjectsResponse = await enRes.json();

	const jpRes = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL!}/api/globals/featured-projects?depth=1&locale=jp`, {
		headers: {
			'X-RateLimit-Bypass': process.env.PAYLOAD_BYPASS_RATE_LIMIT_KEY ?? '',
		} as Record<string, string>,
	});
	const jpProjects: FeaturedProjectsResponse = await jpRes.json();
	const jpMinified = jpProjects.projects.map((project) => (
		{
			title: project.title ?? null,
			shortDescription: project.shortDescription ?? null,
			description: project.description ?? null,
		}
	));

	let moreGuilds = true;
	let page = 1;
	let enGuilds: Guild[] = [];
	const jpGuilds: PageData['guilds']['jp'] = [];

	async function fetchNextGuilds() {
		// Fetch next page
		const enGuildsRes = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL!}/api/guilds?limit=100&page=${page}&depth=5`, {
			headers: {
				'X-RateLimit-Bypass': process.env.PAYLOAD_BYPASS_RATE_LIMIT_KEY ?? '',
			} as Record<string, string>,
		});
		const enBody: PayloadResponse<Guild> = await enGuildsRes.json();

		const jpGuildsRes = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL!}/api/guilds?limit=100&page=${page}&locale=jp&depth=0`, {
			headers: {
				'X-RateLimit-Bypass': process.env.PAYLOAD_BYPASS_RATE_LIMIT_KEY ?? '',
			} as Record<string, string>,
		});
		const jpBody: PayloadResponse<Guild> = await jpGuildsRes.json();

		enGuilds = enGuilds.concat(enBody.docs);

		jpBody.docs.forEach((guild) => {
			jpGuilds.push({
				description: guild.description,
			});
		});

		// Set variables for next fetch
		page += 1;
		moreGuilds = enBody.hasNextPage;
	}

	while (moreGuilds) {
		// eslint-disable-next-line no-await-in-loop
		await fetchNextGuilds();
	}

	return {
		featuredProjects: {
			en: enProjects.projects,
			jp: jpMinified,
		},
		guilds: {
			en: enGuilds as any,
			jp: jpGuilds,
		},
	} as PageData;
}

export default async function Page() {
	const { featuredProjects, guilds } = await fetchData();

	const featuredProjectsHtml = featuredProjects.en
		.map((project) => (
			<Card
				key={`proj-${project.id}`}
				title={project.title}
				description={project.shortDescription}
				button="View"
				url={`/projects/${project.slug}`}
				internal
			/>
		));

	const guildHtml = guilds.en.map((guild) => (
		<Card
			key={`guild-${guild.id}`}
			img={guild.icon.url}
			title={guild.name}
			description={guild.description}
			button="Join!"
			url={`https://discord.gg/${guild.invite}`}
		/>
	));

	return (
		<div className="flex flex-col h-full min-h-screen bg-skin-background-1 dark:bg-skin-dark-background-1">
			<Hero />
			<div className="flex-grow">
				<div className="my-16 w-full flex flex-col items-center">
					<div className="max-w-4xl mx-4 sm:mx-0">
						<div>
							<TextHeader>Featured projects</TextHeader>
							<div className="flex flex-col text-center sm:flex-row sm:flex-wrap sm:-mx-2 sm:justify-center">
								{featuredProjectsHtml.length > 0 ? (
									featuredProjectsHtml
								) : (
									<div className="font-bold text-2xl mt-4 text-black dark:text-white">None</div>
								)}
							</div>
						</div>
						<div className="mt-10">
							<TextHeader>EN Servers</TextHeader>
							<div className="flex flex-col text-center sm:flex-row sm:flex-wrap sm:-mx-2 sm:justify-center">
								{guildHtml.length > 0 ? (
									guildHtml
								) : (
									<div className="font-bold text-2xl mt-4 text-black dark:text-white">None</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
