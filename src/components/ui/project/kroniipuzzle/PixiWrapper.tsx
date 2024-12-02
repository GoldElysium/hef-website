'use client';

import '@pixi/gif';
import { Project, Submission } from '@/types/payload-types';
import { Stage } from '@pixi/react';
import React, { useContext, useEffect, useState } from 'react';
import * as PIXI from 'pixi.js';
import OS from 'phaser/src/device/OS';
import { SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/24/solid';
import PuzzleStoreContext from '@/components/ui/project/kroniipuzzle/puzzle/PuzzleStoreContext';
import PixiPuzzleContainer from './PixiPuzzleContainer';
import usePuzzleStore from './puzzle/PuzzleStoreConsumer';
import SubmissionsModal from './SubmissionsModal';

interface IProps {
	project: Omit<Project, 'flags' | 'devprops'> & {
		flags: string[];
		devprops: {
			[key: string]: string;
		};
	};
	submissions: Submission[];
}

export interface StageSize {
	width: number;
	height: number;
}

export default function PixiWrapper({ project, submissions }: IProps) {
	const [stageSize, setStageSize] = useState<StageSize | null>(null);
	const [ready, setReady] = useState(false);
	const [loadProgress, setLoadProgress] = useState(0);
	const [orientation, setOrientation] = useState('');
	const [showAllSubmissions, setShowAllSubmissions] = useState(false);

	const puzzleStore = useContext(PuzzleStoreContext);
	const { volume, muted } = usePuzzleStore((state) => state.audio);
	const difficultyName = usePuzzleStore((state) => state.difficultyName);
	const [
		setVolume,
		setMuted,
		setDifficulty,
	] = usePuzzleStore((state) => [
		state.setVolume,
		state.setMuted,
		state.setDifficulty,
	]);

	// Resize logic
	useEffect(() => {
		const onResize = () => {
			setStageSize({
				width: window.innerWidth,
				height: window.innerHeight,
			});
		};

		onResize();

		window.addEventListener('resize', onResize);

		return () => {
			window.removeEventListener('resize', onResize);
		};
	}, []);

	useEffect(() => {
		const onOrientationChange = () => {
			setOrientation(window.screen.orientation.type);
		};

		onOrientationChange();

		window.addEventListener('orientationchange', onOrientationChange);

		return () => {
			window.removeEventListener('orientationchange', onOrientationChange);
		};
	}, []);

	useEffect(() => {
		(async () => {
			await PIXI.Assets.init({ manifest: project.devprops.manifestUrl });
			await PIXI.Assets.loadBundle('puzzle', (progress) => {
				setLoadProgress(progress * 100);
			});

			setReady(true);
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		// @ts-ignore
		if (typeof InstallTrigger !== 'undefined') {
			// eslint-disable-next-line no-alert
			alert("Hello there!\nIt seems like you're one of the few others using Firefox. Sadly this game is known to perform quite poorly on Firefox, so we recommend you use Chrome/Edge to play this.");
		} else if (
			// @ts-ignore
			!window.chrome
			// @ts-ignore
			|| typeof window.opr !== 'undefined'
		) {
			// eslint-disable-next-line no-alert
			alert("Unsupported browser\nIt seems like you're not using Chrome or Edge, your browser has not been tested and you may encounter issues while playing. We recommend you use Chrome/Edge to play this.");
		}
	}, []);

	if (!stageSize) return null;

	if (!ready) {
		return (
			<div className="min-w-screen grid size-full min-h-screen place-items-center bg-skin-background text-skin-text dark:bg-skin-background-dark dark:text-skin-text-dark">
				<div>
					<p className="text-lg">
						Loading...
					</p>
					<progress value={loadProgress.toFixed(0)} max={100} className="progress progress-info w-96 max-w-lg" />
				</div>
			</div>
		);
	}

	return (
		<>
			{showAllSubmissions && (
				<SubmissionsModal
					submissions={submissions}
					project={project}
					closeModal={() => setShowAllSubmissions(false)}
				/>
			)}

			{!difficultyName && (
				<div className="absolute left-0 z-20 min-h-screen w-full bg-skin-background dark:bg-skin-background-dark">
					<div className="mx-auto md:max-w-2xl">
						<h1 className="relative mb-4 mt-8 flex items-center justify-center border-b-2 border-skin-text/30 pb-2 text-4xl font-bold text-skin-text dark:border-skin-text-dark/30 dark:text-skin-text-dark">
							Choose difficulty
						</h1>
						<div className="flex flex-col gap-2">
							{Object.keys(JSON.parse(project.devprops.difficulties)).map((name) => (
								<button
									key={name}
									className="bg-skin-primary px-6 py-4 text-skin-primary-foreground dark:bg-skin-primary-dark dark:text-skin-primary-foreground-dark"
									type="button"
									onClick={() => {
										setDifficulty(name);
									}}
								>
									{name}
								</button>
							))}
						</div>
					</div>
				</div>
			)}

			{!OS.desktop && (orientation.startsWith('portrait') || !document.fullscreenElement) && (
				<button
					className="min-w-screen absolute z-10 size-full min-h-screen bg-black text-center text-white"
					type="button"
					onClick={() => {
						document.documentElement.requestFullscreen();
						try {
							// @ts-expect-error Chromium Android only
							window.screen.orientation.lock('landscape');
							// eslint-disable-next-line no-empty
						} catch {
						}
					}}
				>
					This app may not work correctly on mobile devices, we recommend using a large screen.
					Click on screen to fullscreen
				</button>
			)}

			<Stage
				options={{
					backgroundColor: 0x5f79bc,
					antialias: true,
				}}
				className={`${((!OS.desktop && orientation.startsWith('portrait')) || showAllSubmissions) ? 'hidden' : ''} cursor-none`}
			>
				<PuzzleStoreContext.Provider value={puzzleStore}>
					<PixiPuzzleContainer
						aboutText={project.devprops.aboutText.replace(/\\n/g, '\n')}
						stageSize={stageSize}
						submissions={submissions}
						setShowAllSubmissions={setShowAllSubmissions}
					/>
				</PuzzleStoreContext.Provider>
			</Stage>

			<div
				className="fixed bottom-6 left-6 z-50 flex h-16 w-[350px] items-center justify-between gap-2 rounded-lg bg-skin-secondary px-4 py-2 text-white dark:bg-skin-secondary-dark"
			>
				<label className="swap swap-flip">
					<input
						type="checkbox"
						className="!bg-inherit text-black dark:text-white"
						checked={muted}
						onChange={() => setMuted(!muted)}
					/>

					<SpeakerWaveIcon className="swap-off size-6" />
					<SpeakerXMarkIcon className="swap-on size-6" />
				</label>
				<input
					type="range"
					disabled={muted}
					max={1}
					min={0}
					step={0.01}
					value={volume}
					onChange={(e) => setVolume(Number.parseFloat(e.target.value))}
					className="range-s range range-accent !bg-inherit disabled:range-xs"
				/>
			</div>
		</>
	);
}
