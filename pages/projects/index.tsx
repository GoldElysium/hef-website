import { GetStaticProps } from 'next';
import mongoose from 'mongoose';
import safeJsonStringify from 'safe-json-stringify';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import Card from '../../components/Card';
import TextHeader from '../../components/TextHeader';
import Project, { IProject } from '../../models/Project';

interface IProps {
	projects: string;
}

export default function Projects({ projects }: IProps) {
	const parsedProjects: IProject[] = JSON.parse(projects);
	const ongoing = parsedProjects.filter((project) => project.status === 'ongoing');
	const ongoingHtml = ongoing.map((project: IProject) => (
		<Card
			key={project._id}
			title={project.title}
			description={project.shortDescription}
			button="View"
			url={`/projects/${project._id}`}
			internal
		/>
	));

	const past = parsedProjects.filter((project) => project.status === 'past');
	const pastHtml = past.map((project: IProject) => (
		<Card
			key={project._id}
			title={project.title}
			description={project.shortDescription}
			button="View"
			url={`/projects/${project._id}`}
			internal
		/>
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
								{ongoingHtml.length > 0 ? ongoingHtml : <div className="font-bold text-2xl mt-4 text-black dark:text-white">None</div>}
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
	try {
		mongoose.connect(process.env.MONGOOSEURL!);
		// eslint-disable-next-line no-empty
	} catch (e) {
	}

	const projects = safeJsonStringify(await Project.find({}).lean().exec());

	return {
		props: {
			projects,
		},
	};
};
