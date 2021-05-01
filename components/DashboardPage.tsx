import Link from 'next/link';
import { CheckIcon, PlusIcon, ReplyIcon, TrashIcon } from '@heroicons/react/solid';
import { ChangeEvent, useEffect, useState } from 'react';
import DashboardNavbar from './DashboardNavbar';
import DashboardCard from './DashboardCard';
import Footer from './Footer';
import { IGuild } from '../models/Guild';
import { IProject } from '../models/Project';

export default function DashboardPage() {
	const [guilds, setGuilds] = useState<IGuild[]>([]);

	/* eslint-disable no-undef */
	const [projects, setProjects] = useState<JSX.Element[]>([]);
	const [pastProjects, setPastProjects] = useState<JSX.Element[]>([]);

	const [whitelist, setWhitelist] = useState<string[]>([]);
	const [editedWhitelist, setEditedWhitelist] = useState<string[]>([]);
	const [whitelistHtml, setWhitelistHtml] = useState<JSX.Element[] | JSX.Element>([]);
	/* eslint-enable */

	// Whitelist setting
	useEffect(() => {
		fetch('/api/admin/setting?s=whitelist', {
			method: 'GET',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json;charset=UTF-8',
			},
		})
			.then((response) => response.json())
			.then((data) => {
				setWhitelist(data.value);
				setEditedWhitelist(data.value);
			});
	}, []);

	function addWhitelistUser() {
		setEditedWhitelist((prevState) => [...prevState, '']);
	}

	function saveWhitelist() {
		fetch('/api/admin/setting', {
			method: 'PATCH',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json;charset=UTF-8',
			},
			body: JSON.stringify({
				setting: 'whitelist',
				value: editedWhitelist,
			}),
		})
			.then((response) => response.json())
			.then((data) => {
				setWhitelist(data.value);
				setEditedWhitelist(data.value);
			});
	}

	// eslint-disable-next-line consistent-return
	useEffect(() => {
		function updateWhitelistUser(event: ChangeEvent<HTMLInputElement>, index: number) {
			const newWhitelist = [...editedWhitelist];
			newWhitelist[index] = event.currentTarget.value;
			setEditedWhitelist(newWhitelist);
		}

		function removeWhitelistUser(index: number) {
			const newWhitelist = [...editedWhitelist];
			newWhitelist.splice(index, 1);
			setEditedWhitelist(newWhitelist);
		}

		if (editedWhitelist.length === 0) return setWhitelistHtml(<p>None</p>);
		const newHtml = editedWhitelist.map((user, index) => (
			<div className="flex items-center mt-2" key={user}>
				<input type="text" value={user} key={index} className="border-2 rounded-md px-1" placeholder="User ID"
				       onChange={(event) => updateWhitelistUser(event, index)}/>
				<TrashIcon className="w-6 h-6 ml-4 hover:text-gray-500 cursor-pointer" onClick={() => removeWhitelistUser(index)} />
			</div>
		));
		setWhitelistHtml(newHtml);
	}, [editedWhitelist]);

	// Guilds
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
					<DashboardCard key={guild._id} img={guild.image} title={guild.name} description={guild.description} button="Edit" url={`/dashboard/guild/${guild._id}`}/>
				));
				setGuilds(guildHtml);
			});
	}, []);

	// Projects
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
					<DashboardCard key={project._id} title={project.title} description={project.shortDescription} button="Edit" url={`/dashboard/project/${project._id}`}/>
				));

				const past = data.filter((project: IProject) => project.status === 'past');
				const pastHtml = past.map((project: IProject) => (
					<DashboardCard key={project._id} title={project.title} description={project.shortDescription} button="Edit" url={`/dashboard/project/${project._id}`}/>
				));

				setProjects(ongoingHtml);
				setPastProjects(pastHtml);
			});
	}, []);

	return (
		<div className="flex flex-col h-full min-h-screen bg-red-50">
			<DashboardNavbar/>

			<div className="flex-grow">
				<div className="my-16 w-full flex flex-col items-center">
					<div className="max-w-4xl w-full sm:mx-4">
						<div>
							<div className="flex border-b-2 border-red-200 justify-center sm:justify-between items-center text-red-500">
								<h1 className="text-2xl font-bold text-center sm:text-left ml-auto sm:ml-0">Server list</h1>
								<Link href="/dashboard/guild/new">
									<a className="ml-auto sm:ml-0"><PlusIcon className="w-8 h-8 mt-2 hover:text-red-700 cursor-pointer"/></a>
								</Link>
							</div>
							<div
								className="flex flex-col sm:flex-row sm:flex-wrap sm:-mx-2 sm:justify-center items-center">
								{guilds.length > 0 ? guilds : <div className="font-bold text-2xl mt-4">None</div>}
							</div>
						</div>

						<div className="mt-4">
							<div className="flex border-b-2 border-red-200 justify-center sm:justify-between items-center text-red-500">
								<h1 className="text-2xl font-bold text-center sm:text-left ml-auto sm:ml-0">Ongoing projects</h1>
								<Link href="/dashboard/project/new">
									<a className="ml-auto sm:ml-0"><PlusIcon className="w-8 h-8 mt-2 hover:text-red-700 cursor-pointer"/></a>
								</Link>
							</div>
							<div
								className="flex flex-col sm:flex-row sm:flex-wrap sm:-mx-2 sm:justify-center items-center">
								{projects.length > 0 ? projects : <div className="font-bold text-2xl mt-4">None</div>}
							</div>
						</div>

						<div className="mt-4">
							<h1 className="text-2xl text-red-500 font-bold border-b-2 border-red-200 text-center sm:text-left">Past
								projects</h1>
							<div
								className="flex flex-col sm:flex-row sm:flex-wrap sm:-mx-2 sm:justify-center items-center">
								{pastProjects.length > 0 ? pastProjects : <div className="font-bold text-2xl mt-4">None</div>}
							</div>
						</div>
						<div className="mt-4">
							<h1 className="text-2xl text-red-500 font-bold border-b-2 border-red-200 text-center sm:text-left">Settings</h1>
							<div
								className="flex flex-col sm:flex-row sm:flex-wrap sm:-mx-2 sm:justify-center items-center">
								<div className="mt-4 sm:w-1/3">
									<div
										className="bg-white p-8 h-full border-b-4 border-red-500 rounded-lg flex flex-col items-center sm:mx-2 sm:p-3 md:p-8">
										<h2 className="font-bold text-xl mt-3">Whitelist</h2>
										<div className="mt-2">{whitelistHtml}</div>
										<PlusIcon className="w-8 h-8 mt-2 hover:text-gray-500 cursor-pointer"
										          onClick={addWhitelistUser}/>
										{whitelist !== editedWhitelist && <div className="flex items-center">
											<ReplyIcon className="w-6 h-6 cursor-pointer mr-2" onClick={() => setEditedWhitelist(whitelist)} />
											<CheckIcon className="w-6 h-6 cursor-pointer ml-2" onClick={saveWhitelist}/>
										</div>}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<Footer/>
		</div>
	);
}