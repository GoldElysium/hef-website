'use client';

import { Project } from 'types/payload-types';
import { Stage } from '@pixi/react';
import { useEffect, useState } from 'react';
import * as PIXI from 'pixi.js';
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
		(async () => {
			await PIXI.Assets.init({ manifest: '/assets/kroniipuzzle/manifest.json' });
			await PIXI.Assets.loadBundle('puzzle');
			await PIXI.Assets.loadBundle('pieces');

			setReady(true);
		})();
	}, []);

	if (!stageSize) return null;

	// TODO: Loading screen?
	if (!ready) return null;

	return (
		<Stage
			// eslint-disable-next-line max-len
			// TODO: If there's a set viewport width + height, then stage size should follow set aspect ratio.
			width={stageSize.width}
			height={stageSize.height}
			options={{
				backgroundColor: 0x5599ff,
			}}
		>
			<PixiPuzzle project={project} stageSize={stageSize} submissions={submissions} />
		</Stage>
	);
}
