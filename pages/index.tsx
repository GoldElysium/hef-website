import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Card from '../components/Card';
import Footer from '../components/Footer';
import TextHeader from '../components/TextHeader';
import { GetStaticProps } from 'next';
import { Guild, Media, Project } from '../types/payload-types';
import PayloadResponse from '../types/PayloadResponse';

interface IProps {
	featuredProjects: {
		en: Project[];
		jp: {
			title: Project['title'];
			shortDescription: Project['shortDescription'];
			description: Project['description'];
		}[];
	};
	guilds: {
		en: Guild[];
		jp: {
			description: Guild['description'];
		}[];
	};
}

export default function Home({ featuredProjects, guilds }: IProps) {
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
			img={(guild.icon as Media).sizes!.icon!.url}
			title={guild.name}
			description={guild.description}
			button="Join!"
			url={`https://discord.gg/${guild.invite}`}
		/>
	));

	return (
		<div className="flex flex-col h-full min-h-screen bg-skin-background-1 dark:bg-skin-dark-background-1">
			<Navbar />
			<Hero />
			<div className="flex-grow">
				<div className="my-16 w-full flex flex-col items-center">
					<div className="max-w-4xl w-full mx-4">
						<div>
							<TextHeader>Featured projects</TextHeader>
							<div className="flex flex-col sm:flex-row sm:flex-wrap sm:-mx-2 sm:justify-center">
								{featuredProjectsHtml.length > 0 ? (
									featuredProjectsHtml
								) : (
									<div className="font-bold text-2xl mt-4 text-black dark:text-white">None</div>
								)}
							</div>
						</div>
						<div className="mt-10">
							<TextHeader>EN Servers</TextHeader>
							<div className="flex flex-col sm:flex-row sm:flex-wrap sm:-mx-2 sm:justify-center">
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
			<Footer />
		</div>
	);
}

export const getStaticProps: GetStaticProps = async () => {
	interface FeaturedProjectsResponse {
		projects: Project[];
		globalType: string;
		createdAt: string;
		updatedAt: string;
		id: string;
	}


	const enRes = await fetch(`${process.env.CMS_URL!}/api/globals/featured-projects?depth=3`);
	const enProjects: FeaturedProjectsResponse = await enRes.json();

	const jpRes = await fetch(`${process.env.CMS_URL!}/api/globals/featured-projects?depth=1&locale=jp`);
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
	const jpGuilds: IProps['guilds']['jp'] = [];

	async function fetchNextGuilds() {
		// Fetch next page
		const enGuildsRes = await fetch(`${process.env.CMS_URL!}/api/guilds?limit=100&page=${page}&depth=5`);
		const enBody: PayloadResponse<Guild> = await enGuildsRes.json();

		const jpGuildsRes = await fetch(`${process.env.CMS_URL!}/api/guilds?limit=100&page=${page}&locale=jp&depth=0`);
		const jpBody: PayloadResponse<Guild> = await jpGuildsRes.json();

		enGuilds = enGuilds.concat(enBody.docs);

		jpBody.docs.map((guild) => {
			jpGuilds.push({
				description: guild.description,
			});
		});

		// Set variables for next fetch
		page += 1;
		moreGuilds = enBody.hasNextPage;
	}

	while (moreGuilds) {
		await fetchNextGuilds();
	}

	return {
		props: {
			featuredProjects: {
				en: enProjects.projects,
				jp: jpMinified,
			},
			guilds: {
				en: enGuilds,
				jp: jpGuilds,
			},
		} as IProps,
	};
};
