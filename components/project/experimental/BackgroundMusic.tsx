import { useEffect, useRef, useState } from 'react';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Slider from '@material-ui/core/Slider';
import ErrorIcon from '@material-ui/icons/Error';
import VolumeOffIcon from '@material-ui/icons/VolumeOff';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';

export interface ProjectBackgroundMusicProps {
	backgroundMusic: string,
}

// TODO: Themes?

export function ProjectBackgroundMusic({ backgroundMusic }: ProjectBackgroundMusicProps) {
	const audio = useRef<HTMLAudioElement | null>(null);

	const [autoplayed, setAutoplayed] = useState(false);
	const [blocked, setBlocked] = useState(false);
	const [hidden, setHidden] = useState(false);
	const [muted, setMuted] = useState(false); 
	const [volume, setVolume] = useState(0.125);

	useEffect(() => {
		const audioSnapshot = audio.current;

		if (audioSnapshot != null) {
			audioSnapshot.volume = volume;
		}
	}, [ audio, volume ]);

	useEffect(() => {
		if (blocked) return;
		if (autoplayed) return;

		const audioSnapshot = audio.current;

		if (audioSnapshot != null) {
			(async () => {
				const play = () => new Promise((resolve) => {
					const played = audioSnapshot.play();
          
					// Node uses an object for this, browsers use a number.
					let timeout: any;

					const cleanupResolve = (value: boolean) => {
						clearTimeout(timeout);
						resolve(value);
					};

					timeout = setTimeout(() => cleanupResolve(false), 250);

					if (played != null) {
						played
							.then(() => cleanupResolve(true))
							.catch(() => cleanupResolve(false));
					} else {
						resolve(true);
					}
				});

				const autoPlaying = await play();

				if (!autoPlaying) {
					let clickEventListener: () => Promise<void>;
					let hoverEventListener: () => Promise<void>;

					clickEventListener = async () => {
						const nowAutoPlaying = await play();

						if (!nowAutoPlaying) {
							console.warn('This browser _really_ doesn\'t want us to autoplay music, even after interaction, so I guess we just won\'t have any music then.');
							setBlocked(true);
							audioSnapshot.remove();
						} else {
							setAutoplayed(true);
						}

						document.body.removeEventListener('mousedown', clickEventListener);
						document.body.removeEventListener('mouseover', hoverEventListener);
					};

					hoverEventListener = async () => {
						const nowAutoPlaying = await play();

						if (nowAutoPlaying) {
							setAutoplayed(true);
							document.body.removeEventListener('mousedown', clickEventListener);
						}

						document.body.removeEventListener('mouseover', hoverEventListener);
					};

					document.body.addEventListener('mousedown', clickEventListener);
					document.body.addEventListener('mouseover', hoverEventListener);
				}
			})()
				.catch(console.error);
		}
	}, [ audio, autoplayed, blocked ]);

	if (hidden) return (<></>);

	if (blocked) {
		return (
			<Card classes={{ root: 'fixed bottom-4 left-4 z-50 text-black dark:text-white bg-skin-background-2 dark:bg-skin-dark-background-2' }}>
				<div className='relative w-128 h-16 flex justify-center items-center'>
					<Icon classes={{ root: 'flex mx-4' }}>
						<ErrorIcon/>
					</Icon>
					Your browser has denied audio playback
					<Button
						classes={{ root: 'mx-4 text-skin-primary-1 darK:text-skin-primary-1' }}
						variant='text'
						onClick={() => setHidden(true)}>
						Dismiss
					</Button>
				</div>
			</Card>
		);
	}

	return (
		<>
			<audio
				ref={audio}
				controls={false}
				loop={true}
				muted={muted}>
				<source src={backgroundMusic} type='audio/mp3'></source>
			</audio>
			<Card classes={{ root: 'fixed bottom-4 left-4 z-50 bg-skin-card dark:bg-skin-dark-card' }}>
				<div className='relative left-3 w-64 h-16 flex justify-center items-center'>
					<Grid container spacing={1}>
						<Grid item xs={2}>
							<IconButton
								classes={{ root: 'text-black dark:text-white' }}
								onClick={() => setMuted(!muted)}>
								{!muted && (<VolumeUpIcon/>) || (<VolumeOffIcon/>)}
							</IconButton>
						</Grid>
						<Grid item
							classes={{ root: 'flex justify-center items-center' }}
							xs={8}>
							<Slider
								classes={{
									rail: 'bg-skin-background-2 dark:bg-skin-dark-background-2',
									thumb: 'bg-skin-primary-1 dark:bg-skin-dark-primary-1',
									track: 'bg-skin-primary-1 dark:bg-skin-dark-primary-1',
								}}
								disabled={muted}
								max={1}
								min={0}
								step={0.05}
								value={volume}
								onChange={(_, value) => setVolume(value as number)}
							/>
						</Grid>
					</Grid>
				</div>
			</Card>
		</>
	);
}

export default ProjectBackgroundMusic;
