import { useRouter } from 'next/router';
import {
	FormEvent, useEffect, useRef, useState,
} from 'react';
import {
	CheckIcon, PlusIcon, ReplyIcon, XIcon,
} from '@heroicons/react/solid';
import { Snackbar, Alert } from '@material-ui/core';
import { TrashIcon } from '@heroicons/react/outline';
import RichMarkdownEditor from 'rich-markdown-editor';
import DashboardNavbar from './DashboardNavbar';
import Footer from './Footer';
import { ILink, IMedia, IProject } from '../models/Project';
import { ISubmission } from '../models/Submission';
import { IGuild } from '../models/Guild';

interface IErrorMessage {
	text: string,
	severity: 'error' | 'info' | 'success' | 'warning',
}

interface IProps {
	doc: IProject | undefined
}

export default function ProjectEditPage({ doc }: IProps) {
	const router = useRouter();
	const editorRef = useRef<RichMarkdownEditor | null>(null);

	const [status, setStatus] = useState('ongoing');
	const [title, setTitle] = useState('');
	const [guild, setGuild] = useState('');
	const [shortDescription, setShortDescription] = useState('');
	const [description, setDescription] = useState(doc?.description ?? '');
	const [gallery, setGallery] = useState<IMedia[]>([]);
	const [submissions, setSubmissions] = useState<ISubmission[]>([]);
	const [submissionsToDelete, setSubmissionsToDelete] = useState<string[]>([]);
	const [links, setLinks] = useState<ILink[]>([]);
	const [descriptionSet, setDescriptionSet] = useState(false);

	/* eslint-disable no-undef */
	const [galleryHtml, setGalleryHtml] = useState<JSX.Element[]>([]);
	const [submissionsHtml, setSubmissionsHtml] = useState<JSX.Element[]>([]);
	const [linksHtml, setLinksHtml] = useState<JSX.Element[]>([]);

	const [guilds, setGuilds] = useState<JSX.Element[]>([]);
	/* eslint-enable */

	const [errorMessage, setErrorMessage] = useState<IErrorMessage | null>(null);
	const [removeDialogOpen, setRemoveDialogOpen] = useState(false);

	const [originalDoc, setOriginalDoc] = useState<IProject>({
		status: 'ongoing',
		guild: '',
		media: [],
		title: '',
		shortDescription: '',
		description: '',
		// @ts-expect-error Must be date
		date: undefined,
	});
	const [originalSubmissions, setOriginalSubmissions] = useState<ISubmission[]>([]);

	const [changed, setChanged] = useState(false);

	// Init
	useEffect(() => {
		async function run() {
			if (doc) {
				setOriginalDoc(doc);

				const res = await fetch(`/api/submissions/${router.query.id}`, {
					method: 'GET',
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json;charset=UTF-8',
					},
				});

				const responseSubmissions: ISubmission[] = await res.json();
				const newSubmissions = responseSubmissions.map((submission) => {
					if (!submission.type) {
						return {
							...submission,
							type: 'text' as ISubmission['type'],
						};
					}
					return submission;
				});
				setOriginalSubmissions(newSubmissions);

				setTitle(doc.title);
				setShortDescription(doc.shortDescription);
				setDescription(doc.description);
				setGuild(doc.guild);
				setGallery(doc.media ?? []);
				setSubmissions(newSubmissions);
				setLinks(doc.links ?? []);
			}
		}
		run();
	}, [doc, router.query.id]);

	useEffect(() => {
		if (!descriptionSet && editorRef.current) {
			setDescriptionSet(true);
			if (description !== '') {
				const newState = editorRef.current.createState(description);
				editorRef.current.view.updateState(newState);
			}
		}
	}, [editorRef, description, descriptionSet]);

	// Form
	useEffect(() => {
		// eslint-disable-next-line consistent-return
		async function run() {
			const res = await fetch('/api/guilds', {
				method: 'GET',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json;charset=UTF-8',
				},
			});
			if (!res.ok) {
				return setErrorMessage({
					severity: 'error',
					text: 'Something went wrong during guild fetching',
				});
			}

			const json: IGuild[] = await res.json();

			const html = json.map((mapGuild) => (
				<option key={mapGuild._id} value={mapGuild._id}>{mapGuild.name}</option>
			));
			setGuilds(html);
			if (router.query.id === 'new') {
				setGuild(json[0]._id ?? '');
			}
		}

		run();
	}, [router.query.id]);

	useEffect(() => {
		if (
			status === originalDoc.status
			&& title === originalDoc.title
			&& shortDescription === originalDoc.shortDescription
			&& description === originalDoc.description
			&& gallery === originalDoc.media
			&& links === originalDoc.links
			&& submissions === originalSubmissions
		) {
			window.onbeforeunload = () => null;
			setChanged(false);
		} else {
			window.onbeforeunload = () => 'show';
			setChanged(true);
		}
		// eslint-disable-next-line max-len
	}, [description, shortDescription, status, title, gallery, links, submissions, originalDoc, originalSubmissions]);

	function resetForm() {
		setStatus(originalDoc.status);
		setTitle(originalDoc.title);
		setShortDescription(originalDoc.shortDescription);
		setDescription(originalDoc.description);
		setGallery(originalDoc.media ?? []);
		setLinks(originalDoc.links ?? []);
		setSubmissions(originalSubmissions ?? []);
		setSubmissionsToDelete([]);
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
						Accept: 'application/json',
						'Content-Type': 'application/json;charset=UTF-8',
					},
					body: JSON.stringify({
						status, guild, media: gallery, title, shortDescription, description, links,
					} as IProject),
				});
			} else {
				res = await fetch(`/api/projects/${router.query.id}`, {
					method: 'PATCH',
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json;charset=UTF-8',
					},
					body: JSON.stringify({
						status, guild, media: gallery, title, shortDescription, description, links,
					} as IProject),
				});
			}

			if (!res.ok) {
				return setErrorMessage({
					severity: 'error',
					text: 'Something went wrong, please try again.',
				});
			}

			const json: IProject = await res.json();

			const newSubmissions = submissions.map((submission) => ({
				...submission,
				project: json._id,
			}));

			const submissionsRes = await fetch('/api/submissions', {
				method: 'PATCH',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json;charset=UTF-8',
				},
				body: JSON.stringify(newSubmissions),
			});

			if (!submissionsRes.ok) {
				return setErrorMessage({
					severity: 'error',
					text: 'Something went wrong, please try again.',
				});
			}

			if (submissionsToDelete.length > 0) {
				const removeSubmissionsRes = await fetch('/api/submissions', {
					method: 'DELETE',
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json;charset=UTF-8',
					},
					body: JSON.stringify(submissionsToDelete),
				});

				if (!removeSubmissionsRes.ok) {
					return setErrorMessage({
						severity: 'error',
						text: 'Something went wrong, please try again.',
					});
				}
			}

			const submissionsJson: ISubmission[] = await submissionsRes.json();

			setOriginalDoc(json);
			setSubmissions(submissionsJson);
			setChanged(false);
			window.onbeforeunload = () => null;
			setErrorMessage({
				severity: 'success',
				text: 'Saved succesfully',
			});

			if (router.query.id === 'new') router.push(`/dashboard/project/${json._id}`);
		}

		run();
	}

	// eslint-disable-next-line consistent-return
	async function removeProject() {
		const res = await fetch(`/api/projects/${router.query.id}`, {
			method: 'DELETE',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json;charset=UTF-8',
			},
		});

		if (!res.ok) {
			return setErrorMessage({
				severity: 'error',
				text: 'Something went wrong, please try again.',
			});
		}

		setErrorMessage({ severity: 'success', text: 'Deleted successfully' });
		router.push('/dashboard');
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
			// eslint-disable-next-line react/no-array-index-key
			<div className="flex mt-2" key={`link-${index}`}>
				<input
					required
					value={link.name}
					onChange={(event) => updateName(index, event.currentTarget.value)}
					placeholder="Name"
					autoCapitalize="words"
					className="border border-red-300 rounded-md px-1"
				/>
				<input
					required
					value={link.link}
					onChange={(event) => updateLink(index, event.currentTarget.value)}
					placeholder="Link"
					type="url"
					autoCapitalize="words"
					className="border border-red-300 rounded-md px-1 ml-2"
				/>
				<TrashIcon className="w-6 h-6 ml-2 cursor-pointer" onClick={() => removeLink(index)} />
			</div>
		));
		setLinksHtml(html);
	}, [links]);

	function addGalleryItem() {
		setGallery((prevState) => [...prevState, { type: 'image', src: '' }]);
	}

	useEffect(() => {
		function updateType(index: number, type: string) {
			const newGallery = [...gallery];
			newGallery[index].type = type as IMedia['type'];

			if (newGallery[index].type === 'text') newGallery[index].src = undefined;
			else newGallery[index].message = undefined;

			setGallery(newGallery);
		}

		function updateSrc(index: number, src: string) {
			const newGallery = [...gallery];
			newGallery[index].src = src;
			setGallery(newGallery);
		}

		function updateMessage(index: number, message: string) {
			const newGallery = [...gallery];
			newGallery[index].message = message;
			setGallery(newGallery);
		}

		function removeMedia(index: number) {
			const newGallery = [...gallery];
			newGallery.splice(index, 1);
			setGallery(newGallery);
		}

		const html = gallery.map((currentMedia, index) => (
			// eslint-disable-next-line react/no-array-index-key
			<div className="flex mt-2" key={`media-${index}`}>
				<select
					value={currentMedia.type}
					onChange={(event) => updateType(index, event.currentTarget.value)}
					className="border border-red-300 rounded-md px-1 ml-2"
				>
					<option value="image">Image</option>
					<option value="video">Video</option>
					<option value="text">Text</option>
				</select>
				{
					currentMedia.type === 'text'
						? (
							<textarea
								required
								value={currentMedia.message}
								onChange={(event) => updateMessage(index, event.currentTarget.value)}
								placeholder="Message"
								autoCapitalize="words"
								className="border border-red-300 rounded-md px-1 ml-2 w-96"
							/>
						)
						: (
							<input
								required
								value={currentMedia.src}
								onChange={(event) => updateSrc(index, event.currentTarget.value)}
								placeholder="Link"
								type="url"
								className="border border-red-300 rounded-md px-1 ml-2 w-96"
							/>
						)
				}
				<TrashIcon className="w-6 h-6 ml-2 cursor-pointer" onClick={() => removeMedia(index)} />
			</div>
		));

		setGalleryHtml(html);
	}, [gallery]);

	function addSubmission() {
		setSubmissions((prevState) => [...prevState, { type: 'text', message: '' }] as ISubmission[]);
	}

	useEffect(() => {
		function updateType(index: number, type: string) {
			const newSubmissions = [...submissions];
			newSubmissions[index].type = type as ISubmission['type'];

			if (newSubmissions[index].type === 'text') newSubmissions[index].src = undefined;

			setSubmissions(newSubmissions);
		}

		function updateSrc(index: number, src: string) {
			const newSubmissions = [...submissions];
			newSubmissions[index].src = src;
			setSubmissions(newSubmissions);
		}

		function updateMessage(index: number, message: string) {
			const newSubmissions = [...submissions];
			newSubmissions[index].message = message;
			setSubmissions(newSubmissions);
		}

		function updateAuthor(index: number, author: string) {
			const newSubmissions = [...submissions];
			newSubmissions[index].author = author;
			setSubmissions(newSubmissions);
		}

		function updateSrcIcon(index: number, srcIcon: string) {
			const newSubmissions = [...submissions];
			newSubmissions[index].srcIcon = srcIcon;
			setSubmissions(newSubmissions);
		}

		function removeSubmissions(index: number) {
			const newSubmissions = [...submissions];
			if (newSubmissions[index]._id) {
				const newSubmissionsToDelete = [...submissionsToDelete];
				newSubmissionsToDelete.push(newSubmissions[index]._id as unknown as string);
				setSubmissionsToDelete(newSubmissionsToDelete);
			}

			newSubmissions.splice(index, 1);
			setSubmissions(newSubmissions);
		}

		const html = submissions.map((submission, index) => (
			// eslint-disable-next-line react/no-array-index-key
			<div className="flex mt-2" key={`media-${index}`}>
				<div className="grid grid-cols-submissionGrid gap-2 mt-4">
					<label htmlFor={`submissionType-${index}`}>Type:</label>
					<select
						id={`submissionType-${index}`}
						value={submission.type}
						onChange={(event) => updateType(index, event.currentTarget.value)}
						className="border border-red-300 rounded-md px-1 ml-2"
					>
						<option value="text">Text</option>
						<option value="image">Image</option>
						<option value="video">Video</option>
					</select>

					<label htmlFor={`submissionAuthor-${index}`}>Author:</label>
					<input
						id={`submissionAuthor-${index}`}
						value={submission.author}
						onChange={(event) => updateAuthor(index, event.currentTarget.value)}
						placeholder="Name"
						className="border border-red-300 rounded-md px-1 ml-2 w-96"
					/>

					<label htmlFor={`submissionSrcIcon-${index}`}>Avatar link:</label>
					<input
						id={`submissionSrcIcon-${index}`}
						value={submission.srcIcon}
						onChange={(event) => updateSrcIcon(index, event.currentTarget.value)}
						placeholder="Link"
						type="url"
						className="border border-red-300 rounded-md px-1 ml-2 w-96"
					/>

					{(submission.type === 'video' || submission.type === 'image') ? (
						<>
							<label htmlFor={`submissionSrc-${index}`}>
								{submission.type === 'video' ? 'Video ' : 'Image '}
								link:
							</label>
							<input
								required
								id={`submissionSrc-${index}`}
								value={submission.src}
								onChange={(event) => updateSrc(index, event.currentTarget.value)}
								placeholder="Link"
								type="url"
								className="border border-red-300 rounded-md px-1 ml-2 w-96"
							/>
						</>
					)
						: ''}

					<label htmlFor={`submissionMessage-${index}`}>Message:</label>
					{(!submission.type || submission.type === 'text') ? (
						<textarea
							required
							id={`submissionMessage-${index}`}
							value={submission.message}
							onChange={(event) => updateMessage(index, event.currentTarget.value)}
							placeholder="Message"
							autoCapitalize="words"
							className="border border-red-300 rounded-md px-1 ml-2 w-96"
						/>
					)
						: (
							<textarea
								id={`submissionMessage-${index}`}
								value={submission.message}
								onChange={(event) => updateMessage(index, event.currentTarget.value)}
								placeholder="Message"
								autoCapitalize="words"
								className="border border-red-300 rounded-md px-1 ml-2 w-96"
							/>
						)}
				</div>
				<TrashIcon className="w-6 h-6 ml-2 mt-4 cursor-pointer" onClick={() => removeSubmissions(index)} />
			</div>
		));

		setSubmissionsHtml(html);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [submissions]);

	return (
		<div className="flex flex-col h-full min-h-screen bg-red-50">
			<DashboardNavbar />

			{/* Rewrite in Formik? */}
			<div className="flex-grow">
				<div className="my-16 w-full flex flex-col items-center">
					<div className="max-w-4xl w-full sm:mx-4 px-4 sm:px-0">
						<form onSubmit={saveForm}>
							<div
								className="flex border-b-2 border-red-200 justify-between items-center text-red-500 mb-4"
							>
								<h1 className="text-2xl font-bold text-center sm:text-left">Project</h1>
								<div className="flex items-center">
									{removeDialogOpen
										? (
											<>
												<p className="font-bold text-xl">Are you sure?</p>
												<XIcon
													onClick={() => setRemoveDialogOpen(false)}
													className="w-8 h-8 mt-2 ml-4 hover:text-red-700 cursor-pointer"
												/>
												<CheckIcon
													onClick={() => removeProject()}
													className="w-8 h-8 mt-2 ml-4 hover:text-red-700 cursor-pointer"
												/>
											</>
										)
										: (
											<>
												{(router.query.id !== 'new' && changed)
											&& (
												<ReplyIcon
													className="w-8 h-8 mt-2 hover:text-red-700 cursor-pointer"
													onClick={() => resetForm()}
												/>
											)}
												{/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
												<button type="submit">
													<CheckIcon
														className="w-8 h-8 mt-2 ml-4 hover:text-red-700 cursor-pointer"
													/>
												</button>
												{router.query.id !== 'new'
											&& (
												<TrashIcon
													className="w-8 h-8 mt-2 ml-4 hover:text-red-700 cursor-pointer"
													onClick={() => setRemoveDialogOpen(true)}
												/>
											)}
											</>
										)}
								</div>
							</div>
							<div>
								<h2 className="text-xl font-bold text-center sm:text-left ml-auto sm:ml-0 text-red-500">Information</h2>
								<div className="flex flex-col">
									<label htmlFor="title" className="font-bold">Project title</label>
									<input
										required
										value={title}
										onChange={(event) => setTitle(event.currentTarget.value)}
										id="title"
										autoCapitalize="words"
										className="border border-red-300 rounded-md px-1"
									/>
								</div>
								<div className="flex flex-col mt-2">
									<label htmlFor="shortDescription" className="font-bold">Short description</label>
									<input
										required
										value={shortDescription}
										onChange={(event) => setShortDescription(event.currentTarget.value)}
										id="shortDescription"
										autoCapitalize="on"
										className="border border-red-300 rounded-md px-1"
									/>
								</div>
								<div className="flex flex-col mt-2">
									<label htmlFor="description" className="font-bold">Description</label>
									<div className="border border-red-300 bg-white min-h-[20vh] max-h-[40vh] rounded-md overflow-auto resize-y">
										<RichMarkdownEditor
											onChange={setDescription}
											id="description"
											ref={editorRef}
											defaultValue={'# Welcome\n\nJust an easy to use **Markdown** editor with `slash commands`'}
											className="rounded-md px-1 w-full"
										/>
									</div>
									<textarea
										required
										value={description}
										onChange={() => {}}
										className="hidden"
									/>
								</div>
								<div className="flex flex-col mt-2">
									<label htmlFor="guild" className="font-bold">Organizer</label>
									<select
										required
										value={guild}
										onChange={(event) => setGuild(event.currentTarget.value)}
										id="guild"
										autoCapitalize="on"
										className="border border-red-300 rounded-md px-1"
									>
										{guilds}
									</select>
								</div>
								<div className="flex flex-col mt-2">
									<label htmlFor="status" className="font-bold">Status</label>
									<select
										required
										value={status}
										onChange={(event) => setStatus(event.currentTarget.value)}
										id="status"
										autoCapitalize="on"
										className="border border-red-300 rounded-md px-1"
									>
										<option value="ongoing">Ongoing</option>
										<option value="past">Past</option>
									</select>
								</div>
								<div className="flex flex-col mt-2">
									<div className="flex items-center">
										<label htmlFor="status" className="font-bold">Links</label>
										<PlusIcon
											className="w-6 h-6 mt-1 hover:text-gray-500 cursor-pointer"
											onClick={() => addLink()}
										/>
									</div>
									{linksHtml}
								</div>
							</div>
							<div>
								<div className="flex justify-between">
									<h2 className="text-xl font-bold text-center sm:text-left text-red-500 mt-4">Media</h2>
									<PlusIcon className="w-8 h-8 mt-2 text-red-500 cursor-pointer" onClick={() => addGalleryItem()} />
								</div>
								<div>
									{galleryHtml}
								</div>
							</div>
							{/* TODO: Move submissions to separate tab */}
							<div>
								<div className="flex justify-between">
									<h2 className="text-xl font-bold text-center sm:text-left text-red-500 mt-4">Submissions</h2>
									<PlusIcon className="w-8 h-8 mt-2 text-red-500 cursor-pointer" onClick={() => addSubmission()} />
								</div>
								<div>
									{submissionsHtml}
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>

			<Snackbar
				open={errorMessage !== null}
				onClose={() => setErrorMessage(null)}
				autoHideDuration={6000}
				anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
				className="mt-16"
			>
				<Alert onClose={() => setErrorMessage(null)} elevation={8} variant="filled" severity={errorMessage?.severity}>
					{errorMessage?.text}
				</Alert>
			</Snackbar>

			<Footer />
		</div>
	);
}
