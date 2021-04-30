import { useRouter } from 'next/router';
import { FormEvent, useEffect, useState } from 'react';
import Error from 'next/error';
import { CheckIcon, PlusIcon, ReplyIcon } from '@heroicons/react/solid';
import { Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { TrashIcon } from '@heroicons/react/outline';
import DashboardNavbar from './DashboardNavbar';
import Footer from './Footer';
import { ILink, IMedia, IProject, ISubmission } from '../models/Project';
import { IGuild } from '../models/Guild';

interface IMessage {
	text: string,
	severity: 'error' | 'info' | 'success' | 'warning',
}

export default function ProjectEditPage() {
	const router = useRouter();

	const [status, setStatus] = useState('ongoing');
	const [title, setTitle] = useState('');
	const [guild, setGuild] = useState('');
	const [shortDescription, setShortDescription] = useState('');
	const [description, setDescription] = useState('');
	const [media, setMedia] = useState<IMedia[]>([]);
	const [submissions, setSubmissions] = useState<ISubmission[]>([]);
	const [links, setLinks] = useState<ILink[]>([]);

	const [mediaHtml, setMediaHtml] = useState<JSX.Element[]>([]);
	const [submissionsHtml, setSubmissionsHtml] = useState<JSX.Element[]>([]);
	const [linksHtml, setLinksHtml] = useState<JSX.Element[]>([]);

	const [guilds, setGuilds] = useState<JSX.Element[]>([]);

	const [message, setMessage] = useState<IMessage | null>(null);

	const [originalDoc, setOriginalDoc] = useState<IProject>({
		status: 'ongoing',
		guild: '',
		media: [],
		submissions: [],
		title: '',
		shortDescription: '',
		description: '',
		// @ts-expect-error Must be date
		date: undefined,
	});

	const [changed, setChanged] = useState(false);

	const [errorCode, setErrorCode] = useState<boolean | number>(false);

	// Init

	useEffect(() => {
		// eslint-disable-next-line consistent-return
		async function run() {
			if (router.query.id && router.query.id !== 'new') {
				const res = await fetch(`/api/projects/${router.query.id}`, {
					method: 'GET',
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json;charset=UTF-8',
					},
				});
				if (!res.ok) return setErrorCode(res.status);

				const json: IProject = await res.json();

				setOriginalDoc(json);
			}
		}

		run();
	}, [router.query]);

	// Form
	useEffect(() => {
		// eslint-disable-next-line consistent-return
		async function run() {
			const res = await fetch('/api/guilds', {
				method: 'GET',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json;charset=UTF-8',
				},
			});
			if (!res.ok) return setMessage({
				severity: 'error',
				text: 'Something went wrong during guild fetching',
			});

			const json: IGuild[] = await res.json();

			const html = json.map((mapGuild) => (
				<option key={mapGuild._id} value={mapGuild._id}>{mapGuild.name}</option>
			));
			setGuilds(html);
		}

		run();
	}, []);

	useEffect(() => {
		if (
			status === originalDoc.status
			&& title === originalDoc.title
			&& shortDescription === originalDoc.shortDescription
			&& description === originalDoc.description
			&& media === originalDoc.media
			&& links === originalDoc.links
			&& submissions === originalDoc.submissions
		) {
			window.onbeforeunload = () => null;
			setChanged(false);
		} else {
			window.onbeforeunload = () => 'show';
			setChanged(true);
		}
	}, [description, shortDescription, status, title, media, links, submissions, originalDoc]);

	function resetForm() {
	}

	function saveForm(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		// eslint-disable-next-line consistent-return
		async function run() {
			let res;
			if (router.query.id === 'new') {
				res = await fetch('/api/projects', {
					method: 'POST',
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json;charset=UTF-8',
					},
					body: JSON.stringify({} as IProject),
				});
			} else {
				res = await fetch(`/api/projects/${router.query.id}`, {
					method: 'PATCH',
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json;charset=UTF-8',
					},
					body: JSON.stringify({ id: router.query.id, update: {} as IProject }),
				});
			}

			if (!res.ok) return setMessage({
				severity: 'error',
				text: 'Something went wrong, please try again.',
			});

			const json: IProject = await res.json();

			setOriginalDoc(json);
			setMessage({
				severity: 'success',
				text: 'Saved succesfully',
			});

			if (router.query.id === 'new')
				router.push(`/dashboard/project/${json._id}`);
		}

		run();
	}

	// Information functions
	function addLink() {
		setLinks((prevState) => [...prevState, { name: '', link: '' }]);
	}

	useEffect(() => {
		function updateName(index: number, name: string) {
			const newLinks = [...links];
			newLinks[index].name = name;
			setLinks(newLinks);
		}

		function updateLink(index: number, link: string) {
			const newLinks = [...links];
			newLinks[index].link = link;
			setLinks(newLinks);
		}

		function removeLink(index: number) {
			const newLinks = [...links];
			newLinks.splice(index, 1);
			setLinks(newLinks);
		}

		const html = links.map((link, index) => (
			<div className="flex mt-2" key={link.name}>
				<input required
				       value={link.name}
				       onChange={(event) => updateName(index, event.currentTarget.value)}
				       placeholder="Name"
				       autoCapitalize="words"
				       className="border border-red-300 rounded-md px-1"/>
				<input required
				       value={link.link}
				       onChange={(event) => updateLink(index, event.currentTarget.value)}
				       placeholder="Link"
				       type="url"
				       autoCapitalize="words"
				       className="border border-red-300 rounded-md px-1 ml-2"/>
				<TrashIcon className="w-6 h-6 ml-2 cursor-pointer" onClick={() => removeLink(index)}/>
			</div>
		));
		setLinksHtml(html);
	}, [links]);

	function addMedia() {

	}

	useEffect(() => {

	}, [media]);

	function addSubmission() {

	}

	useEffect(() => {

	}, [submissions]);

	if (errorCode) {
		return <Error statusCode={errorCode as number}/>;
	}

	return (
		<div className="flex flex-col h-full min-h-screen bg-red-50">
			<DashboardNavbar/>

			{/* TODO: Rewrite in Formik? */}
			<div className="flex-grow">
				<div className="my-16 w-full flex flex-col items-center">
					<div className="max-w-4xl w-full sm:mx-4 px-4 sm:px-0">
						<form onSubmit={saveForm}>
							<div
								className="flex border-b-2 border-red-200 justify-between items-center text-red-500 mb-4">
								<h1 className="text-2xl font-bold text-center sm:text-left">Project</h1>
								<div className="flex">
									{(router.query.id !== 'new' && changed) &&
									<ReplyIcon className="w-8 h-8 mt-2 hover:text-red-700 cursor-pointer"
											   onClick={() => resetForm()}/>}
									{/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
									<button type="submit"><CheckIcon
										className="w-8 h-8 mt-2 ml-4 hover:text-red-700 cursor-pointer"/></button>
								</div>
							</div>
							<div>
								<h2 className="text-xl font-bold text-center sm:text-left ml-auto sm:ml-0 text-red-500">Information</h2>
								<div className="flex flex-col">
									<label htmlFor="title" className="font-bold">Project title</label>
									<input required
									       value={title}
									       onChange={(event) => setTitle(event.currentTarget.value)}
									       id="title"
									       autoCapitalize="words"
									       className="border border-red-300 rounded-md px-1"/>
								</div>
								<div className="flex flex-col mt-2">
									<label htmlFor="shortDescription" className="font-bold">Short description</label>
									<input required
									       value={shortDescription}
									       onChange={(event) => setShortDescription(event.currentTarget.value)}
									       id="shortDescription"
									       autoCapitalize="on"
									       className="border border-red-300 rounded-md px-1"/>
								</div>
								<div className="flex flex-col mt-2">
									<label htmlFor="description" className="font-bold">Description</label>
									<input required
									       value={description}
									       onChange={(event) => setDescription(event.currentTarget.value)}
									       id="description"
									       autoCapitalize="on"
									       className="border border-red-300 rounded-md px-1"/>
								</div>
								<div className="flex flex-col mt-2">
									<label htmlFor="guild" className="font-bold">Organizer</label>
									<select required
									        value={guild}
									        onChange={(event) => setGuild(event.currentTarget.value)}
									        id="guild"
									        autoCapitalize="on"
									        className="border border-red-300 rounded-md px-1">
										{guilds}
									</select>
								</div>
								<div className="flex flex-col mt-2">
									<label htmlFor="status" className="font-bold">Status</label>
									<select required
									        value={status}
									        onChange={(event) => setStatus(event.currentTarget.value)}
									        id="status"
									        autoCapitalize="on"
									        className="border border-red-300 rounded-md px-1">
										<option value="ongoing">Ongoing</option>
										<option value="past">Past</option>
									</select>
								</div>
								<div className="flex flex-col mt-2">
									<div className="flex items-center">
										<label htmlFor="status" className="font-bold">Links</label>
										<PlusIcon className="w-6 h-6 mt-1 hover:text-gray-500 cursor-pointer" onClick={addLink}/>
									</div>
									{linksHtml}
								</div>
							</div>
							<div>
								<div className="flex justify-between">
									<h2 className="text-xl font-bold text-center sm:text-left text-red-500 mt-4">Media</h2>
									<PlusIcon className="w-8 h-8 mt-2 text-red-500 cursor-pointer" onClick={addMedia}/>
								</div>

							</div>
							<div>
								<div className="flex justify-between">
									<h2 className="text-xl font-bold text-center sm:text-left text-red-500 mt-4">Submissions</h2>
									<PlusIcon className="w-8 h-8 mt-2 text-red-500 cursor-pointer"/>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>

			<Snackbar open={message !== null} onClose={() => setMessage(null)}
			          autoHideDuration={6000}
			          anchorOrigin={{ vertical: 'top', horizontal: 'right' }} className="mt-16">
				<Alert onClose={() => setMessage(null)} elevation={8} variant="filled" severity={message?.severity}>
					{message?.text}
				</Alert>
			</Snackbar>

			<Footer/>
		</div>
	);
}