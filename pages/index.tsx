import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Card from '../components/Card';
import Footer from '../components/Footer';
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
				'Accept': 'application/json',
				'Content-Type': 'application/json;charset=UTF-8',
			},
		})
			.then((response) => response.json())
			.then((data) => {
				const guildHtml = data.map((guild: IGuild) => (
					<Card img={guild.image} title={guild.name} description={guild.description} button="Join!" url={`https://discord.gg/${guild.invite}`}/>
				));
				setGuilds(guildHtml);
			});
	}, []);

	useEffect(() => {
		fetch('/api/projects', {
			method: 'GET',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json;charset=UTF-8',
			},
		})
			.then((response) => response.json())
			.then((data) => {
				let projectHtml = [];
				if (data.length <= 3) projectHtml = data.map((project: IProject) => (
					<Card title={project.title} description={project.shortDescription} button="View" url={`/projects/${project._id}`} internal/>
				));
				// eslint-disable-next-line no-plusplus
				else for (let i = 0; i < 3; i++) {
					projectHtml.push(<Card title={data[i].title} description={data[i].shortDescription} button="View" url={`/projects/${data[i]._id}`} internal/>);
				}
				setFeaturedProjects(projectHtml);
			});
	}, []);


	return (
		<div className="flex flex-col h-full min-h-screen bg-red-50">
			<Navbar/>
			<Hero/>

			<div className="flex-grow">
				<div className="my-16 w-full flex flex-col items-center">
					<div className="max-w-4xl w-full mx-4">
						<div>
							<h1 className="text-2xl text-red-500 font-bold border-b-2 border-red-200 text-center sm:text-left">Featured projects</h1>
							<div className="flex flex-col sm:flex-row sm:flex-wrap sm:-mx-2 sm:justify-center">
								{featuredProjects.length > 0 ? featuredProjects : <div className="font-bold text-2xl mt-4">None</div>}
							</div>
						</div>
						<div className="mt-10">
							<h1 className="text-2xl text-red-500 font-bold border-b-2 border-red-200 text-center sm:text-left">EN Servers</h1>
							<div className="flex flex-col sm:flex-row sm:flex-wrap sm:-mx-2 sm:justify-center">
								{guilds.length > 0 ? guilds : <div className="font-bold text-2xl mt-4">None</div>}
							</div>
						</div>
					</div>
				</div>
			</div>

			<Footer/>
		</div>
	);
}
