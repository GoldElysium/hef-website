import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Card from '../components/Card';
import Footer from '../components/Footer';
import TextHeader from '../components/TextHeader';
import { IGuild } from '../models/Guild';
import { IProject } from '../models/Project';

export default function Home() {
	/* eslint-disable no-undef */
	const [featuredProjects, setFeaturedProjects] = useState<JSX.Element[]>([]);
	const [guilds, setGuilds] = useState<JSX.Element[]>([]);
	/* eslint-enable */

	useEffect(() => {
		fetch('/api/guilds', {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json;charset=UTF-8',
			},
		})
			.then((response) => response.json())
			.then((data) => {
				const guildHtml = data.map((guild: IGuild) => (
					<Card
						key={guild._id}
						img={guild.image}
						title={guild.name}
						description={guild.description}
						button="Join!"
						url={`https://discord.gg/${guild.invite}`}
					/>
				));
				setGuilds(guildHtml);
			});
	}, []);

	useEffect(() => {
		fetch('/api/projects', {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json;charset=UTF-8',
			},
		})
			.then((response) => response.json())
			.then((data) => {
				let projectHtml = [];

				projectHtml = data
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

				setFeaturedProjects(projectHtml);
			});
	}, []);

	return (
		<div className="flex flex-col h-full min-h-screen bg-skin-background-1 dark:bg-skin-dark-background-1">
			<Navbar />
			<Hero />
			<div className="flex-grow">
				<div className="my-16 w-full flex flex-col items-center">
					<div className="max-w-4xl w-full mx-4">
						<div>
							<TextHeader text="Featured projects" />
							<div className="flex flex-col sm:flex-row sm:flex-wrap sm:-mx-2 sm:justify-center">
								{featuredProjects.length > 0 ? (
									featuredProjects
								) : (
									<div className="font-bold text-2xl mt-4 text-black dark:text-white">None</div>
								)}
							</div>
						</div>
						<div className="mt-10">
							<TextHeader text="EN Servers" />
							<div className="flex flex-col sm:flex-row sm:flex-wrap sm:-mx-2 sm:justify-center">
								{guilds.length > 0 ? (
									guilds
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
