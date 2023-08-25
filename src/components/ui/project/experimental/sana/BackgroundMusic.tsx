'use client';

import {
	useCallback, useEffect, useRef, useState,
} from 'react';
import { ExclamationCircleIcon, SpeakerXMarkIcon, SpeakerWaveIcon } from '@heroicons/react/24/solid';

export interface ProjectBackgroundMusicProps {
	backgroundMusic: string,
}

export default function ProjectBackgroundMusic({ backgroundMusic }: ProjectBackgroundMusicProps) {
	const audio = useRef<HTMLAudioElement | null>(null);

	const [autoplayed, setAutoplayed] = useState(false);
	const [blocked, setBlocked] = useState(false);
	const [dismissed, setDismissed] = useState(false);
	const [hidden, setHidden] = useState(false);
	const [muted, setMuted] = useState(false);
	const [volume, setVolume] = useState(0.125);
	const [y, setY] = useState(0.0);

	useEffect(() => {
		const audioSnapshot = audio.current;

		if (audioSnapshot != null) {
			audioSnapshot.volume = volume;
		}
	}, [audio, volume]);

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
					const clickEventListener = async () => {
						const nowAutoPlaying = await play();

						if (!nowAutoPlaying) {
							// eslint-disable-next-line no-console
							console.warn('This browser _really_ doesn\'t want us to autoplay music, even after interaction, so I guess we just won\'t have any music then.');
							setBlocked(true);
							audioSnapshot.remove();
						} else {
							setAutoplayed(true);
						}

						document.body.removeEventListener('mousedown', clickEventListener);
						// eslint-disable-next-line @typescript-eslint/no-use-before-define
						document.body.removeEventListener('mouseover', hoverEventListener);
					};

					const hoverEventListener = async () => {
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
				// eslint-disable-next-line no-console
				.catch(console.error);
		}
	}, [audio, autoplayed, blocked]);

	const scrollEventListener = useCallback(() => {
		if (window.scrollY > y) {
			setHidden(true);
		} else if (window.scrollY < y) {
			setHidden(false);
		}

		setY(window.scrollY);
	}, [y]);

	useEffect(() => {
		setY(window.scrollY);
		window.addEventListener('scroll', scrollEventListener);

		return () => window.removeEventListener('scroll', scrollEventListener);
	}, [scrollEventListener]);

	if (dismissed) return null;

	if (blocked) {
		return (
			<div
				className={
					`${(hidden) ? 'translate-y-16 opacity-0' : ''} bg-skin-card dark:bg-skin-dark-card fixed bottom-4 left-4 z-50 rounded-lg px-4 text-black transition-all duration-500 motion-reduce:transition-none dark:text-white`
				}
			>
				<div className="w-128 relative flex h-16 items-center justify-center gap-2">
					<ExclamationCircleIcon className="h-6 w-6" />
					Your browser has denied audio playback
					<button
						type="button"
						className="text-skin-primary-1 darK:text-skin-primary-1 mx-4"
						onClick={() => {
							setHidden(true);
							setTimeout(() => setDismissed(true), 1000);
						}}
					>
						Dismiss
					</button>
				</div>
			</div>
		);
	}

	return (
		<>
			{/* eslint-disable-next-line jsx-a11y/media-has-caption */}
			<audio
				ref={audio}
				controls={false}
				loop
				muted={muted}
			>
				<source src={backgroundMusic} type="audio/mp3" />
			</audio>
			<div
				className={`${(hidden) ? 'translate-y-16 opacity-0' : ''} bg-skin-card dark:bg-skin-dark-card fixed bottom-4 left-4 z-50 flex h-16 w-64 items-center justify-between gap-2 rounded-lg px-4 py-2 text-black transition-all motion-reduce:transition-none dark:text-white`}
			>
				<label className="swap swap-flip">
					<input
						type="checkbox"
						className="text-black dark:text-white"
						checked={muted}
						onChange={() => setMuted(!muted)}
						onFocus={() => setHidden(false)}
					/>

					<SpeakerWaveIcon className="swap-off h-6 w-6" />
					<SpeakerXMarkIcon className="swap-on h-6 w-6" />
				</label>
				<input
					type="range"
					disabled={muted}
					max={1}
					min={0}
					step={0.05}
					value={volume}
					onChange={(e) => setVolume(Number.parseFloat(e.target.value))}
					onFocus={() => setHidden(false)}
					className="range-s range range-accent disabled:range-xs"
				/>
			</div>
		</>
	);
}
