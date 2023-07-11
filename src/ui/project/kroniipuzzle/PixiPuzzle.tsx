'use client';

import { Graphics, Sprite, useApp } from '@pixi/react';
import { Project } from 'types/payload-types';
import {
	useCallback, useEffect, useMemo, useState,
} from 'react';
import * as PIXI from 'pixi.js';
import type { StageSize } from './PixiWrapper';
import Viewport from './pixi/Viewport';
import Sidebar from './pixi/Sidebar';
import Button from './pixi/Button';
import Modal from './pixi/Modal';
import Puzzle from './puzzle/Puzzle';
import ViewportContext from './providers/ViewportContext';

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

	const [showModal, setShowModal] = useState(false);
	const [disableDragging, setDisableDragging] = useState(false);

	const viewportContextMemo = useMemo(
		() => (
			{
				disableDragging,
				setDisableDragging,
			}
		),
		[disableDragging],
	);

	// ! TODO: Remove, only here for Pixi devtools
	useEffect(() => {
		// @ts-ignore
		globalThis.__PIXI_APP__ = app;
	}, []);

	const sidebarWidth = 400;
	const viewportWidth = stageSize.width - sidebarWidth;
	const width = viewportWidth / 2;
	const height = width / 2;
	const x = sidebarWidth + height;
	const y = stageSize.height / 2 - height / 2;

	const drawColorForSidebar = useCallback((g: PIXI.Graphics) => {
		g.beginFill(0xff9955);
		g.drawRect(0, 0, sidebarWidth, stageSize.height);
		g.endFill();
	}, [stageSize]);

	return (
		<ViewportContext.Provider value={viewportContextMemo}>
			{/* @ts-ignore */}
			<Viewport
				width={viewportWidth}
				height={stageSize.height}
				disableDragging={disableDragging}
				app={app}
			>
				<Sprite
					image="https://pixijs.io/pixi-react/img/bunny.png"
					x={sidebarWidth + viewportWidth / 2}
					y={270}
					anchor={{ x: 0.5, y: 0.5 }}
				/>
				<Puzzle
					x={x}
					y={y}
					width={width}
					height={height}
				/>
			</Viewport>
			{/* @ts-ignore */}
			<Sidebar width={sidebarWidth} height={stageSize.height} app={app}>
				<Graphics
					width={sidebarWidth}
					height={stageSize.height}
					draw={drawColorForSidebar}
				/>
				<Button
					x={0}
					y={0}
					width={200}
					height={100}
					label="Preview"
					onClick={() => { setShowModal(true); }}
				/>
				<Sprite
					image="https://pixijs.io/pixi-react/img/bunny.png"
					x={200}
					y={270}
					anchor={{ x: 0.5, y: 0.5 }}
				/>
			</Sidebar>

			{showModal && (
				<Modal
					x={0}
					y={0}
					width={stageSize.width}
					height={stageSize.height}
					label="Dismiss"
					onClick={() => { setShowModal(false); }}
				/>
			)}
		</ViewportContext.Provider>
	);
}
