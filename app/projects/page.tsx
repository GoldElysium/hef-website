import Card from 'components/Card';
import TextHeader from 'components/TextHeader';
import { Project } from 'types/payload-types';
import PayloadResponse from 'types/PayloadResponse';

interface ProjectList {
	en: Project[];
	jp: {
		title: Project['title'];
		shortDescription: Project['shortDescription'];
		description: Project['description'];
	}[];
}

async function fetchProjects() {
	let moreProjects = true;
	let page = 1;
	let enProjects: Project[] = [];
	const jpProjects: ProjectList['jp'] = [];

	async function fetchNextProjects() {
		// Fetch next page
		const enProjectsRes = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL!}/api/projects?limit=100&page=${page}&depth=2`, {
			headers: {
				'X-RateLimit-Bypass': process.env.PAYLOAD_BYPASS_RATE_LIMIT_KEY ?? '',
			} as Record<string, string>,
		});
		const enBody: PayloadResponse<Project> = await enProjectsRes.json();

		const jpProjectsRes = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL!}/api/projects?limit=100&page=${page}&locale=jp&depth=0`, {
			headers: {
				'X-RateLimit-Bypass': process.env.PAYLOAD_BYPASS_RATE_LIMIT_KEY ?? '',
			} as Record<string, string>,
		});
		const jpBody: PayloadResponse<Project> = await jpProjectsRes.json();

		enProjects = enProjects.concat(enBody.docs);

		jpBody.docs.forEach((project) => {
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
		// eslint-disable-next-line no-await-in-loop
		await fetchNextProjects();
	}

	return {
		en: enProjects,
		jp: jpProjects,
	} as ProjectList;
}

export default async function Page() {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { en, jp } = await fetchProjects();

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
			<div className="flex-grow">
				<div className="my-16 w-full flex flex-col items-center">
					<div className="max-w-4xl w-full mx-4">
						<div>
							<TextHeader>Ongoing projects</TextHeader>
							<div className="flex flex-col sm:flex-row sm:flex-wrap sm:-mx-2 sm:justify-center">
								{ongoingProjects.length > 0 ? ongoingProjects : <div className="font-bold text-2xl mt-4 text-black dark:text-white">None</div>}
							</div>
						</div>
						<div className="mt-10">
							<TextHeader>Past projects</TextHeader>
							<div className="flex flex-col sm:flex-row sm:flex-wrap sm:-mx-2 sm:justify-center">
								{pastProjects.length > 0 ? pastProjects : <div className="font-bold text-2xl mt-4 text-black dark:text-white">None</div>}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
