'use client';

import { Project } from 'types/payload-types';
import { Stage } from '@pixi/react';
import { useEffect, useState } from 'react';
import * as PIXI from 'pixi.js';
// @ts-ignore
import OS from 'phaser/src/device/OS';
import PixiPuzzle from './PixiPuzzle';
import Message from './puzzle/Message';

interface IProps {
	project: Omit<Project, 'flags' | 'devprops'> & {
		flags: string[];
		devprops: {
			[key: string]: string;
		};
	};
	submissions: Message[];
}

export interface StageSize {
	width: number;
	height: number;
}

export default function PixiWrapper({ project, submissions }: IProps) {
	const [stageSize, setStageSize] = useState<StageSize | null>(null);
	const [ready, setReady] = useState(false);
	const [orientation, setOrientation] = useState('');

	// TODO: Check if mobile, if so, force landscape and fullscreen like guratanabata.

	// Resize logic
	useEffect(() => {
		const onResize = () => {
			// TODO: properly resize the canvas
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
			await PIXI.Assets.loadBundle('puzzle');
			await PIXI.Assets.loadBundle('pieces');

			setReady(true);
		})();
	}, []);

	if (!stageSize) return null;

	// TODO: Loading screen, loadBundle has a onProgress callback function
	if (!ready) return null;

	return (
		<>
			{!OS.desktop && orientation.startsWith('portrait') && (
				<button
					className="text-center z-10 min-h-screen min-w-screen h-full w-full bg-black text-white absolute"
					type="button"
					onClick={() => {
						document.documentElement.requestFullscreen().then(() => {
							window.screen.orientation.lock('landscape');
						});
					}}
				>
					Click to screen to fullscreen
				</button>
			)}
			<Stage
				options={{
					backgroundColor: 0x5599ff,
				}}
			>
				<PixiPuzzle project={project} stageSize={stageSize} submissions={submissions} />
			</Stage>
		</>
	);
}
