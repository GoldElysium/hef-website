'use client';

import { Graphics, Sprite, useApp } from '@pixi/react';
import { Project } from 'types/payload-types';
import { useCallback } from 'react';
import * as PIXI from 'pixi.js';
import type { StageSize } from './PixiWrapper';
import Viewport from './pixi/Viewport';

interface IProps {
	project: Omit<Project, 'flags' | 'devprops'> & {
		flags: string[];
		devprops: {
			[key: string]: string;
		};
	};
	stageSize: StageSize;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function PixiPuzzle({ project, stageSize }: IProps) {
	const app = useApp();

	const drawColor = useCallback((g: PIXI.Graphics) => {
		g.beginFill(0x00ff00);
		g.drawRect(0, 0, stageSize.width - 400, stageSize.height);
		g.endFill();
	}, [stageSize]);

	return (
		<>
			{/* @ts-ignore */}
			<Viewport width={stageSize.width - 400} height={stageSize.height} app={app}>
				<Graphics
					width={stageSize.width}
					height={stageSize.height}
					draw={drawColor}
				/>
				<Sprite
					image="https://pixijs.io/pixi-react/img/bunny.png"
					x={400}
					y={270}
					anchor={{ x: 0.5, y: 0.5 }}
				/>
			</Viewport>
			<Sprite
				image="https://pixijs.io/pixi-react/img/bunny.png"
				x={stageSize.width - 200}
				y={270}
				anchor={{ x: 0.5, y: 0.5 }}
			/>
		</>
	);
}
