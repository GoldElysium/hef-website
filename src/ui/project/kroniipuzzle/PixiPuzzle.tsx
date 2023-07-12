'use client';

import {
	Sprite, useApp,
} from '@pixi/react';
import { Project } from 'types/payload-types';
import {
	useEffect, useMemo, useState,
} from 'react';
import { UPDATE_PRIORITY } from 'pixi.js';
import { addStats } from 'pixi-stats';
import type { StageSize } from './PixiWrapper';
import Viewport from './pixi/Viewport';
import Sidebar from './pixi/Sidebar';
import Modal from './pixi/Modal';
import Puzzle from './puzzle/Puzzle';
import ViewportContext from './providers/ViewportContext';
import PuzzleCompleteModal from './pixi/PuzzleCompleteModal';
import PieceDisplay from './pixi/PieceDisplay';
import PieceInfo from './puzzle/PieceInfo';
import Message from './puzzle/Message';

interface IProps {
	project: Omit<Project, 'flags' | 'devprops'> & {
		flags: string[];
		devprops: {
			[key: string]: string;
		};
	};
	stageSize: StageSize;
	submissions: Message[];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function PixiPuzzle({ project, stageSize, submissions }: IProps) {
	const app = useApp();

	const [showModal, setShowModal] = useState(false);
	const [showPuzzleCompleteModal, setShowPuzzleCompleteModal] = useState(false);
	const [disableDragging, setDisableDragging] = useState(false);
	const [selectedPiece, setSelectedPiece] = useState<PieceInfo | undefined>(undefined);

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

	// ! TODO: REMOVE IN PRODUCTION (And don't forget to remove the dependency)
	useEffect(() => {
		const stats = addStats(document, app);
		app.ticker.add(stats.update, stats, UPDATE_PRIORITY.UTILITY);
	}, []);

	return (
		<ViewportContext.Provider value={viewportContextMemo}>
			{/* @ts-ignore */}
			<Viewport
				// TODO: Set world width and height?
				width={stageSize.width}
				height={stageSize.height}
				disableDragging={disableDragging}
				app={app}
				x={sidebarWidth}
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
					onPieceSelected={(piece: PieceInfo) => setSelectedPiece(piece)}
					submissions={submissions}
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
					y={stageSize.height * 0.25}
					width={sidebarWidth}
					height={stageSize.height * 0.75}
					pieceInfo={selectedPiece}
				/>
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
