'use client';

import { useApp } from '@pixi/react';
import { Project } from 'types/payload-types';
import {
	useEffect, useMemo, useRef, useState,
} from 'react';
import { UPDATE_PRIORITY } from 'pixi.js';
import { addStats } from 'pixi-stats';
import type { Viewport as PixiViewport } from 'pixi-viewport';
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
import {
	PUZZLE_WIDTH, SIDEBAR_WIDTH, WORLD_HEIGHT, WORLD_WIDTH,
} from './puzzle/PuzzleConfig';

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
export default function PixiPuzzleContainer({ project, stageSize, submissions }: IProps) {
	const app = useApp();

	const [showModal, setShowModal] = useState(false);
	const [showPuzzleCompleteModal, setShowPuzzleCompleteModal] = useState(false);
	const [disableDragging, setDisableDragging] = useState(false);
	const [selectedPiece, setSelectedPiece] = useState<PieceInfo | undefined>(undefined);
	const viewportRef = useRef<PixiViewport | null>(null);

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

	useEffect(() => {
		app.renderer.resize(stageSize.width, stageSize.height);
		viewportRef.current?.fit();
	}, [stageSize]);

	// ! TODO: REMOVE IN PRODUCTION (And don't forget to remove the dependency)
	useEffect(() => {
		const stats = addStats(document, app);
		app.ticker.add(stats.update, stats, UPDATE_PRIORITY.UTILITY);
	}, []);

	return (
		<ViewportContext.Provider value={viewportContextMemo}>
			<Viewport
				width={stageSize.width}
				height={stageSize.height}
				worldWidth={WORLD_WIDTH}
				worldHeight={WORLD_HEIGHT}
				disableDragging={disableDragging}
				app={app}
				x={SIDEBAR_WIDTH}
				ref={viewportRef}
			>
				<Puzzle
					x={SIDEBAR_WIDTH + PUZZLE_WIDTH / 2}
					y={(WORLD_HEIGHT / 2 + PUZZLE_WIDTH / 4) - WORLD_WIDTH / 4}
					width={PUZZLE_WIDTH}
					height={PUZZLE_WIDTH / 2}
					puzzleFinished={() => setShowPuzzleCompleteModal(true)}
					onPieceSelected={(piece: PieceInfo) => setSelectedPiece(piece)}
					submissions={submissions}
				/>
			</Viewport>
			<Sidebar
				width={SIDEBAR_WIDTH}
				height={stageSize.height}
				setShowModal={setShowModal}
			>
				<PieceDisplay
					y={stageSize.height * 0.25}
					width={SIDEBAR_WIDTH}
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
