'use client';

import {
	Graphics, Sprite, useApp,
} from '@pixi/react';
import { Project } from 'types/payload-types';
import { useCallback } from 'react';
import * as PIXI from 'pixi.js';
import type { StageSize } from './PixiWrapper';
import Viewport from './pixi/Viewport';
import Sidebar from './pixi/Sidebar';

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

	const drawColorForViewport = useCallback((g: PIXI.Graphics) => {
		g.beginFill(0x5599ff);
		g.drawRect(400, 0, stageSize.width - 400, stageSize.height);
		g.endFill();
	}, [stageSize]);
	const drawColorForSidebar = useCallback((g: PIXI.Graphics) => {
		g.beginFill(0xff5599);
		g.drawRect(0, 0, 400, stageSize.height);
		g.endFill();
	}, [stageSize]);

	return (
		<>
			{/* @ts-ignore */}
			<Viewport width={stageSize.width - 400} height={stageSize.height} app={app}>
				<Graphics
					width={stageSize.width - 400}
					height={stageSize.height}
					draw={drawColorForViewport}
				/>
				<Sprite
					image="https://pixijs.io/pixi-react/img/bunny.png"
					x={400 + (stageSize.width - 400) / 2}
					y={270}
					anchor={{ x: 0.5, y: 0.5 }}
				/>
			</Viewport>
			{/* @ts-ignore */}
			<Sidebar width={400} height={stageSize.height} app={app}>
				<Graphics
					width={400}
					height={stageSize.height}
					draw={drawColorForSidebar}
				/>
				<Sprite
					image="https://pixijs.io/pixi-react/img/bunny.png"
					x={200}
					y={270}
					anchor={{ x: 0.5, y: 0.5 }}
				/>
			</Sidebar>
		</>
	);
}
