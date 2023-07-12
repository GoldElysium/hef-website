'use client';

import {
	Graphics, Sprite, useApp, Text,
} from '@pixi/react';
import { Project } from 'types/payload-types';
import {
	useCallback, useEffect, useMemo, useState,
} from 'react';
import * as PIXI from 'pixi.js';
import { TextStyle } from 'pixi.js';
import type { StageSize } from './PixiWrapper';
import Viewport from './pixi/Viewport';
import Sidebar from './pixi/Sidebar';
import Modal from './pixi/Modal';
import Puzzle from './puzzle/Puzzle';
import ViewportContext from './providers/ViewportContext';
import PuzzleCompleteModal from './pixi/PuzzleCompleteModal';
import PieceDisplay from './pixi/PieceDisplay';

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
	const [showPuzzleCompleteModal, setShowPuzzleCompleteModal] = useState(false);
	const [disableDragging, setDisableDragging] = useState(false);
	const [selectedPiece, setSelectedPiece] = useState(null as any);

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
	}, [app]);

	const sidebarWidth = 400;
	const viewportWidth = stageSize.width - sidebarWidth;
	const width = viewportWidth / 2;
	const height = width / 2;
	const x = sidebarWidth + height;
	const y = stageSize.height / 2 - height / 2;

	const drawColorForPieceDisplay = useCallback((g: PIXI.Graphics) => {
		g.beginFill(0xdd8866);
		g.drawRect(0, stageSize.height - sidebarWidth, sidebarWidth, sidebarWidth);
		g.endFill();
	}, [stageSize]);

	return (
		<ViewportContext.Provider value={viewportContextMemo}>
			{/* @ts-ignore */}
			<Viewport
				width={stageSize.width}
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
					puzzleFinished={() => setShowPuzzleCompleteModal(true)}
					onPieceSelected={(piece: any) => setSelectedPiece(piece)}
				/>
			</Viewport>
			{/* @ts-ignore */}
			<Sidebar
				width={sidebarWidth}
				height={stageSize.height}
				setShowModal={setShowModal}
			>
				<Sprite
					image="https://pixijs.io/pixi-react/img/bunny.png"
					x={200}
					y={270}
					anchor={{ x: 0.5, y: 0.5 }}
				/>
				{/* @ts-ignore */}
				<PieceDisplay
					width={sidebarWidth}
					height={sidebarWidth}
				>
					<Graphics
						width={sidebarWidth}
						height={sidebarWidth}
						draw={drawColorForPieceDisplay}
					/>

					<Text
						text={selectedPiece?.message}
						style={{
							align: 'center',
							fill: 'white',
							fontSize: 25,
							wordWrap: true,
							wordWrapWidth: sidebarWidth,
						} as TextStyle}
						x={0}
						y={stageSize.height - sidebarWidth}
						scale={1}
					/>
				</PieceDisplay>
			</Sidebar>

			{showModal && (
				<Modal
					x={0}
					y={0}
					width={stageSize.width}
					height={stageSize.height}
					onClick={() => { setShowModal(false); }}
				/>
			)}

			{showPuzzleCompleteModal && (
				<PuzzleCompleteModal
					x={0}
					y={0}
					width={stageSize.width}
					height={stageSize.height}
					onClick={() => { setShowPuzzleCompleteModal(false); }}
				/>
			)}
		</ViewportContext.Provider>
	);
}
