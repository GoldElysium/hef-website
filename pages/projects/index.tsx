import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import Card from '../../components/Card';
import { IProject } from '../../models/Project';

export default function Projects() {
	const router = useRouter();
	const { query } = router;

	const [filter, setFilter] = useState([] as string[]);
	const [filterMenuOpen, setFilterMenuOpen] = useState(false);

	const [pastFilter, setPastFilter] = useState([] as string[]);
	const [pastFilterMenuOpen, setPastFilterMenuOpen] = useState(false);

	/* eslint-disable no-undef */
	const [projects, setProjects] = useState<JSX.Element[]>([]);
	const [pastProjects, setPastProjects] = useState<JSX.Element[]>([]);
	/* eslint-enable */

	useEffect(() => {
		if (query.server) {
			setFilter([query.server as string]);
			setPastFilter([query.server as string]);
		}
	}, [query]);


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
				const ongoing = data.filter((project: IProject) => project.status === 'ongoing');
				const ongoingHtml = ongoing.map((project: IProject) => (
					<Card key={project._id} title={project.title} description={project.shortDescription} button="View" url={`/projects/${project._id}`} internal/>
				));

				const past = data.filter((project: IProject) => project.status === 'past');
				const pastHtml = past.map((project: IProject) => (
					<Card key={project._id} title={project.title} description={project.shortDescription} button="View" url={`/projects/${project._id}`} internal/>
				));

				setProjects(ongoingHtml);
				setPastProjects(pastHtml);
			});
	}, []);

	return (
		<div className="flex flex-col h-full min-h-screen bg-red-50">
			<Navbar/>

			<Header title="Projects" description="A list of all the projects organized by Hololive EN Fan servers!"/>
			<div className="flex-grow">
				<div className="my-16 w-full flex flex-col items-center">
					<div className="max-w-4xl w-full mx-4">
						<div>
							<h1 className="text-2xl text-red-500 font-bold border-b-2 border-red-200 text-center sm:text-left">Ongoing
							projects</h1>
							<div className="flex flex-col sm:flex-row sm:flex-wrap sm:-mx-2 sm:justify-center items-center">
								{projects.length > 0 ? projects : <div className="font-bold text-2xl mt-4">None</div>}
							</div>
						</div>
						<div className="mt-10">
							<h1 className="text-2xl text-red-500 font-bold border-b-2 border-red-200 text-center sm:text-left">Past
							projects</h1>
							<div className="flex flex-col sm:flex-row sm:flex-wrap sm:-mx-2 sm:justify-center items-center">
								{pastProjects.length > 0 ? pastProjects : <div className="font-bold text-2xl mt-4">None</div>}
							</div>
						</div>
					</div>
				</div>
			</div>

			<Footer/>
		</div>
	);
}