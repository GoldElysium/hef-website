import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import Card from '../../components/Card';
import TextHeader from '../../components/TextHeader';
import { GetStaticProps } from 'next';
import PayloadResponse from '../../types/PayloadResponse';
import { Project } from '../../types/payload-types';

interface IProps {
	en: Project[];
	jp: {
		title: Project['title'];
		shortDescription: Project['shortDescription'];
		description: Project['description'];
	}[];
}

export default function Projects({ en }: IProps) {
	const ongoing = en.filter((project: Project) => project.status === 'ongoing');
	const ongoingProjects = ongoing.map((project: Project) => (
		<Card key={project.id} title={project.title} description={project.shortDescription} button="View" url={`/projects/${project.slug}`} internal />
	));

	const past = en.filter((project: Project) => project.status === 'past');
	const pastProjects = past.map((project: Project) => (
		<Card key={project.id} title={project.title} description={project.shortDescription} button="View" url={`/projects/${project.slug}`} internal />
	));

	return (
		<div className="flex flex-col h-full min-h-screen bg-skin-background-1 dark:bg-skin-dark-background-1">
			<Navbar />

			<Header title="Projects" description="A list of all the projects organized by Hololive EN Fan servers!" />
			<div className="flex-grow">
				<div className="my-16 w-full flex flex-col items-center">
					<div className="max-w-4xl w-full mx-4">
						<div>
							<TextHeader text="Ongoing projects" />
							<div className="flex flex-col sm:flex-row sm:flex-wrap sm:-mx-2 sm:justify-center">
								{ongoingProjects.length > 0 ? ongoingProjects : <div className="font-bold text-2xl mt-4 text-black dark:text-white">None</div>}
							</div>
						</div>
						<div className="mt-10">
							<TextHeader text="Past projects" />
							<div className="flex flex-col sm:flex-row sm:flex-wrap sm:-mx-2 sm:justify-center">
								{pastHtml.length > 0 ? pastHtml : <div className="font-bold text-2xl mt-4 text-black dark:text-white">None</div>}
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
	let moreProjects = true;
	let page = 1;
	let enProjects: Project[] = [];
	const jpProjects: IProps['jp'] = [];

	async function fetchNextGuilds() {
		// Fetch next page
		const enGuildsRes = await fetch(`${process.env.CMS_URL!}/api/projects?limit=100&page=${page}&depth=2`);
		const enBody: PayloadResponse<Project> = await enGuildsRes.json();

		const jpGuildsRes = await fetch(`${process.env.CMS_URL!}/api/projects?limit=100&page=${page}&locale=jp&depth=0`);
		const jpBody: PayloadResponse<Project> = await jpGuildsRes.json();

		enProjects = enProjects.concat(enBody.docs);

		jpBody.docs.map((project) => {
			jpProjects.push({
				title: project.title,
				shortDescription: project.shortDescription,
				description: project.description,
			});
		});

		// Set variables for next fetch
		page += 1;
		moreProjects = enBody.hasNextPage;
	}

	while (moreProjects) {
		await fetchNextGuilds();
	}

	return {
		props: {
			en: enProjects,
			jp: jpProjects,
		} as IProps,
	};
};
