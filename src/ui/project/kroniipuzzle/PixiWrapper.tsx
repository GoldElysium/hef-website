'use client';

import '@pixi/gif';
import { Project, Submission } from 'types/payload-types';
import { Stage } from '@pixi/react';
import React, { useEffect, useState } from 'react';
import * as PIXI from 'pixi.js';
import OS from 'phaser/src/device/OS';
import { SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/24/solid';
import PixiPuzzleContainer from './PixiPuzzleContainer';
import usePuzzleStore from './puzzle/PuzzleStore';
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

	const { volume, muted } = usePuzzleStore((state) => state.audio);
	const [setVolume, setMuted] = usePuzzleStore((state) => [state.setVolume, state.setMuted]);

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
			await PIXI.Assets.init({ manifest: '/assets/kroniipuzzle/manifest.json' });
			await PIXI.Assets.loadBundle('puzzle', (progress) => {
				setLoadProgress(progress * 100);
			});

			setReady(true);
		})();
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
			alert("Unsupported browser\nIt seems like you're not using Chrome or Edge, your browser has not been tested and you may encounter issues while playing. We recommend you use Chrome/Edge to play this");
		}
	}, []);

	if (!stageSize) return null;

	if (!ready) {
		return (
			<div className="min-h-screen h-full min-w-screen w-full grid place-items-center bg-[#E6F0FF] dark:bg-[#021026] dark:text-white">
				<div>
					<p className="text-lg">
						Loading...
					</p>
					<progress value={loadProgress.toFixed(0)} max={100} className="progress progress-info w-96 max-w-lg" />
				</div>
			</div>
		);
	}

	function iOS() {
		return [
			'iPad Simulator',
			'iPhone Simulator',
			'iPod Simulator',
			'iPad',
			'iPhone',
			'iPod',
		].includes(navigator.platform)
		// iPad on iOS 13 detection
		|| (navigator.userAgent.includes('Mac') && 'ontouchend' in document);
	}

	return (

		// eslint-disable-next-line react/jsx-no-useless-fragment
		<>
			{!iOS() && (
				<>
					{!OS.desktop && (orientation.startsWith('portrait') || !document.fullscreenElement) && (
						<button
							className="text-center z-10 min-h-screen min-w-screen h-full w-full bg-black text-white absolute"
							type="button"
							onClick={() => {
								document.documentElement.requestFullscreen().then(() => {
									window.screen.orientation.lock('landscape');
								});
							}}
						>
							This app may not work correctly on mobile devices, we recommend using a large screen.
							Click to screen to fullscreen
						</button>
					)}

					{showAllSubmissions && (
						<SubmissionsModal
							submissions={submissions}
							project={project}
							closeModal={() => setShowAllSubmissions(false)}
						/>
					)}

					<Stage
						options={{
							backgroundColor: 0x5f79bc,
							antialias: true,
						}}
						className={`${((!OS.desktop && orientation.startsWith('portrait')) || showAllSubmissions) ? 'hidden' : ''} cursor-none`}
					>
						<PixiPuzzleContainer
							stageSize={stageSize}
							submissions={submissions}
							setShowAllSubmissions={setShowAllSubmissions}
						/>
					</Stage>

					<div className="fixed left-6 bottom-6 z-50 text-white bg-[#255494] rounded-lg w-[350px] h-16 flex justify-between items-center gap-2 px-4 py-2">
						<label className="swap swap-flip">
							<input
								type="checkbox"
								className="text-black dark:text-white"
								checked={muted}
								onChange={() => setMuted(!muted)}
							/>

							<SpeakerWaveIcon className="swap-off w-6 h-6" />
							<SpeakerXMarkIcon className="swap-on w-6 h-6" />
						</label>
						<input
							type="range"
							disabled={muted}
							max={1}
							min={0}
							step={0.01}
							value={volume}
							onChange={(e) => setVolume(Number.parseFloat(e.target.value))}
							className="range range-accent range-s disabled:range-xs"
						/>
					</div>
				</>
			)}
		</>
	);
}
