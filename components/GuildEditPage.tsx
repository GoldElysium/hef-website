import { useRouter } from 'next/router';
import { FormEvent, useEffect, useState } from 'react';
import Error from 'next/error';
import { CheckIcon, ReplyIcon, XIcon } from '@heroicons/react/solid';
import DateTimePicker from '@material-ui/lab/DateTimePicker';
import { createMuiTheme, Snackbar, TextField, ThemeProvider } from '@material-ui/core';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';
import { CalendarIcon, ClockIcon, TrashIcon } from '@heroicons/react/outline';
import { Alert } from '@material-ui/lab';
import { IGuild } from '../models/Guild';
import DashboardNavbar from './DashboardNavbar';
import Footer from './Footer';

const muiTheme = createMuiTheme({
	palette: {
		primary: {
			light: '#F87171',
			main: '#EF4444',
			dark: '#DC2626',
			contrastText: '#FFF',
		},
	},
});

interface IMessage {
	text: string,
	severity: 'error' | 'info' | 'success' | 'warning',
}

export default function GuildEditPage() {
	const router = useRouter();

	const [name, setName] = useState('');
	const [image, setImage] = useState('');
	const [description, setDescription] = useState('');
	const [invite, setInvite] = useState('');
	const [debutDate, setDebutDate] = useState<Date | null>(null);

	const [message, setMessage] = useState<IMessage | null>(null);
	const [removeDialogOpen, setRemoveDialogOpen] = useState(false);

	const [originalDoc, setOriginalDoc] = useState<IGuild>({
		name: '',
		image: '',
		description: '',
		invite: '',
		// @ts-expect-error Must be date
		debutDate: null,
	});

	const [changed, setChanged] = useState(false);

	const [errorCode, setErrorCode] = useState<boolean | number>(false);

	useEffect(() => {
		// eslint-disable-next-line consistent-return
		async function run() {
			if (router.query.id && router.query.id !== 'new') {
				const res = await fetch(`/api/guilds/${router.query.id}`, {
					method: 'GET',
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json;charset=UTF-8',
					},
				});
				if (!res.ok) return setErrorCode(res.status);

				const json: IGuild = await res.json();

				setOriginalDoc(json);
				setName(json.name);
				setImage(json.image);
				setDescription(json.description);
				setInvite(json.invite);
				setDebutDate(json.debutDate);
			}
		}

		run();
	}, [router.query]);

	useEffect(() => {
		if (
			name === originalDoc.name
			&& image === originalDoc.image
			&& description === originalDoc.description
			&& invite === originalDoc.invite
			&& debutDate === originalDoc.debutDate
		) {
			window.onbeforeunload = () => null;
			setChanged(false);
		} else {
			window.onbeforeunload = () => 'show';
			setChanged(true);
		}
	}, [name, image, description, invite, debutDate, originalDoc]);

	function resetForm() {
		setName(originalDoc.name);
		setImage(originalDoc.image);
		setDescription(originalDoc.description);
		setInvite(originalDoc.invite);
		setDebutDate(originalDoc.debutDate);
	}

	function saveForm(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		// eslint-disable-next-line consistent-return
		async function run() {
			let res;
			if (router.query.id === 'new') {
				res = await fetch('/api/guilds', {
					method: 'POST',
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json;charset=UTF-8',
					},
					body: JSON.stringify({ name, image, description, invite, debutDate } as IGuild),
				});
			} else {
				res = await fetch(`/api/guilds/${router.query.id}`, {
					method: 'PATCH',
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json;charset=UTF-8',
					},
					body: JSON.stringify({ name, image, description, invite, debutDate } as IGuild),
				});
			}

			if (!res.ok) return setMessage({
				severity: 'error',
				text: 'Something went wrong, please try again.',
			});

			const json: IGuild = await res.json();

			setOriginalDoc(json);
			setChanged(false);
			window.onbeforeunload = () => null;
			setMessage({
				severity: 'success',
				text: 'Saved succesfully',
			});

			if (router.query.id === 'new')
				router.push(`/dashboard/guild/${json._id}`);
		}

		run();
	}

	// eslint-disable-next-line consistent-return
	async function removeGuild() {
		const res = await fetch(`/api/guilds/${router.query.id}`, {
			method: 'DELETE',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json;charset=UTF-8',
			},
		});

		if (!res.ok) return setMessage({
			severity: 'error',
			text: 'Something went wrong, please try again.',
		});

		setMessage({ severity: 'success', text: 'Deleted successfully' });
		router.push('/dashboard');
	}

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
								<h1 className="text-2xl font-bold text-left">Server</h1>
								<div className="flex items-center">
									{removeDialogOpen ?
										<>
											<p className="font-bold text-xl">Are you sure?</p>
											<XIcon onClick={() => setRemoveDialogOpen(false)}
											       className="w-8 h-8 mt-2 ml-4 hover:text-red-700 cursor-pointer" />
											<CheckIcon onClick={removeGuild}
												className="w-8 h-8 mt-2 ml-4 hover:text-red-700 cursor-pointer"/>
										</>
										:
										<>
											{(router.query.id !== 'new' && changed) &&
											<ReplyIcon className="w-8 h-8 mt-2 hover:text-red-700 cursor-pointer"
												   onClick={() => resetForm()}/>}
											{/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
											<button type="submit"><CheckIcon
												className="w-8 h-8 mt-2 ml-4 hover:text-red-700 cursor-pointer"/></button>
											{router.query.id !== 'new' &&
											<TrashIcon className="w-8 h-8 mt-2 ml-4 hover:text-red-700 cursor-pointer"
										           onClick={() => setRemoveDialogOpen(true)}/>}
										</>}
								</div>
							</div>
							<div className="flex flex-col">
								<label htmlFor="name" className="font-bold">Server Name</label>
								<input onChange={(event) => setName(event.currentTarget.value)} value={name} required
								       id="name"
								       autoCapitalize="words"
								       className="border border-red-300 rounded-md px-1"/>
							</div>
							<div className="flex flex-col mt-2">
								<label htmlFor="description" className="font-bold">Description</label>
								<textarea onChange={(event) => setDescription(event.currentTarget.value)} required
								          value={description}
								          id="description"
								          autoCapitalize="on"
								          className="border border-red-300 rounded-md px-1"/>
							</div>
							<div className="flex flex-col mt-2">
								<label htmlFor="invite" className="font-bold">Invite</label>
								<input
									onChange={(event) => setInvite(event.currentTarget.value.replace(/^(http(s)?:\/\/)?(www\.)?discord(app)?.(gg|com)\/(invite\/)?/gi, ''))}
									required
									value={invite}
									id="invite"
									className="border border-red-300 rounded-md px-1"/>
							</div>
							<div className="flex flex-col mt-2">
								<label htmlFor="image" className="font-bold">Image</label>
								<input
									onChange={(event) => setImage(event.currentTarget.value)} required
									value={image}
									id="image"
									type="url"
									className="border border-red-300 rounded-md px-1"/>
							</div>
							<ThemeProvider theme={muiTheme}>
								<LocalizationProvider dateAdapter={AdapterDateFns}>
									<div className="flex flex-col mt-2">
										<label htmlFor="debutDate" className="font-bold">Debut date</label>
										<DateTimePicker
											openPickerIcon={<CalendarIcon className="w-6 h-6"/>}
											dateRangeIcon={<CalendarIcon className="w-6 h-6 text-white"/>}
											timeIcon={<ClockIcon className="w-6 h-6 text-white"/>}
											ampm={false}
											renderInput={(props) => <TextField {...props} id="debutDate"
											                                   variant="standard" helperText="" label=""
											                                   className="px-1" required/>}
											label="DateTimePicker"
											value={debutDate}
											onChange={(newValue) => {
												setDebutDate(newValue as Date);
											}}
										/>
									</div>
								</LocalizationProvider>
							</ThemeProvider>
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