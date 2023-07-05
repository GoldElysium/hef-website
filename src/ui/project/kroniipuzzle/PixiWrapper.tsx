'use client';

import { Project } from 'types/payload-types';
import { Stage } from '@pixi/react';
import { useEffect, useState } from 'react';
import PixiPuzzle from './PixiPuzzle';

interface IProps {
	project: Omit<Project, 'flags' | 'devprops'> & {
		flags: string[];
		devprops: {
			[key: string]: string;
		};
	};
}

export interface StageSize {
	width: number;
	height: number;
}

export default function PixiWrapper({ project }: IProps) {
	const [stageSize, setStageSize] = useState<StageSize | null>(null);

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

	if (!stageSize) return null;

	return (
		<Stage width={stageSize.width} height={stageSize.height}>
			<PixiPuzzle project={project} stageSize={stageSize} />
		</Stage>
	);
}
