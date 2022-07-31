import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Card from '../components/Card';
import Footer from '../components/Footer';
import TextHeader from '../components/TextHeader';
import Guild, { IGuild } from '../models/Guild';
import Project, { IProject } from '../models/Project';
import { GetStaticProps } from 'next';
import mongoose from 'mongoose';
import safeJsonStringify from 'safe-json-stringify';

interface IProps {
	guilds: string;
	projects: string;
}

export default function Home({ guilds, projects }: IProps) {
	const parsedGuilds: IGuild[] = JSON.parse(guilds);
	const parsedProjects: IProject[] = JSON.parse(projects);

	const guildHtml = parsedGuilds.map((guild: IGuild) => (
		<Card
			key={guild._id}
			img={guild.image}
			title={guild.name}
			description={guild.description}
			button="Join!"
			url={`https://discord.gg/${guild.invite}`}
		/>
	));

	const projectHtml = parsedProjects
		.filter((project: IProject) => project.status === 'ongoing')
		.slice(0, 3)
		.map((project: IProject) => (
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
			<Navbar/>
			<Hero/>
			<div className="flex-grow">
				<div className="my-16 w-full flex flex-col items-center">
					<div className="max-w-4xl w-full mx-4">
						<div>
							<TextHeader text="Featured projects"/>
							<div className="flex flex-col sm:flex-row sm:flex-wrap sm:-mx-2 sm:justify-center">
								{projectHtml.length > 0 ? (
									projectHtml
								) : (
									<div className="font-bold text-2xl mt-4 text-black dark:text-white">None</div>
								)}
							</div>
						</div>
						<div className="mt-10">
							<TextHeader text="EN Servers"/>
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
			<Footer/>
		</div>
	);
}

export const getStaticProps: GetStaticProps = async () => {
	try {
		mongoose.connect(process.env.MONGOOSEURL!);
		// eslint-disable-next-line no-empty
	} catch (e) {
	}

	const guilds = safeJsonStringify(await Guild.find({}).lean().exec());
	const projects = await Project.find({}).lean().exec();
	const filteredProjects = projects.filter((project) => project.status === 'ongoing').slice(0, 3);

	return {
		props: {
			guilds,
			projects: safeJsonStringify(filteredProjects),
		},
	};
};
