'use client';

import {
	Container, Graphics, Text, useApp,
} from '@pixi/react';
import { Project } from 'types/payload-types';
import React, {
	useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import { Graphics as PixiGraphics, Renderer, TextStyle } from 'pixi.js';
import type { Viewport as PixiViewport } from 'pixi-viewport';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context';
import type { StageSize } from './PixiWrapper';
import Viewport from './pixi/Viewport';
import Sidebar from './pixi/Sidebar';
import Puzzle from './puzzle/Puzzle';
import ViewportContext from './providers/ViewportContext';
import PuzzleCompleteModal from './pixi/PuzzleCompleteModal';
import PieceDisplay from './pixi/PieceDisplay';
import PieceInfo from './puzzle/PieceInfo';
import Message from './puzzle/Message';
import {
	PUZZLE_WIDTH, SIDEBAR_WIDTH, WORLD_HEIGHT, WORLD_WIDTH,
} from './puzzle/PuzzleConfig';
import Button from './pixi/Button';
import Preview from './pixi/Preview';
import SettingsModal from './pixi/Settings';
import Cursor from './pixi/Cursor';

interface IProps {
	project: Omit<Project, 'flags' | 'devprops'> & {
		flags: string[];
		devprops: {
			[key: string]: string;
		};
	};
	stageSize: StageSize;
	submissions: Message[];
	router: AppRouterInstance;
}

export default function PixiPuzzleContainer({
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	project, stageSize, submissions, router,
}: IProps) {
	const app = useApp();

	const [showPreview, setShowPreview] = useState(false);
	const [showExitModal, setShowExitModal] = useState(false);
	const [showSettingsModal, setShowSettingsModal] = useState(false);
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

	useEffect(() => {
		(app.renderer as Renderer).framebuffer.blit();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		app.renderer.resize(stageSize.width, stageSize.height);
		viewportRef.current?.fit();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [stageSize]);

	const drawPuzzleContainer = useCallback((g: PixiGraphics) => {
		g.clear();
		g.beginFill(0x001E47);
		g.drawRect(SIDEBAR_WIDTH, 0, stageSize.width, stageSize.height);
		g.endFill();
		g.beginHole();
		// eslint-disable-next-line max-len
		g.drawRoundedRect(SIDEBAR_WIDTH, 16, stageSize.width - SIDEBAR_WIDTH - 16, stageSize.height - 32, 8);
		g.endHole();
	}, [stageSize]);

	return (
		<ViewportContext.Provider value={viewportContextMemo}>
			<Viewport
				width={stageSize.width}
				height={stageSize.height}
				worldWidth={WORLD_WIDTH}
				worldHeight={WORLD_HEIGHT}
				disableDragging={disableDragging}
				app={app}
				ref={viewportRef}
			>
				<Puzzle
					x={SIDEBAR_WIDTH + (PUZZLE_WIDTH * 1.2) / 2}
					y={(WORLD_HEIGHT / 2 + (PUZZLE_WIDTH * 1.2) / 4) - WORLD_WIDTH / 4}
					width={PUZZLE_WIDTH}
					height={PUZZLE_WIDTH / 2}
					puzzleFinished={() => setShowPuzzleCompleteModal(true)}
					onPieceSelected={(piece: PieceInfo) => {
						if (piece.id !== selectedPiece?.id) {
							setSelectedPiece(piece);
						}
					}}
					submissions={submissions}
				/>
			</Viewport>
			<Graphics
				draw={drawPuzzleContainer}
			/>
			<Sidebar
				width={SIDEBAR_WIDTH}
				height={stageSize.height}
				setShowPreview={setShowPreview}
				setShowExitModal={setShowExitModal}
				setShowSettingsModal={setShowSettingsModal}
			>
				<PieceDisplay
					x={16}
					y={stageSize.height * 0.15}
					width={SIDEBAR_WIDTH - 32}
					height={stageSize.height * 0.75 - 16}
					pieceInfo={selectedPiece}
				/>
			</Sidebar>

			{showPreview && (
				<Preview setShowPreview={setShowPreview} />
			)}

			{
				showExitModal && (
					<Container>
						<Graphics
							draw={(g: PixiGraphics) => {
								g.clear();
								g.beginFill(0x222222);
								g.drawRect(0, 0, stageSize.width, stageSize.height);
								g.endFill();
							}}
						/>
						<Text
							text="Are you sure you want to leave?"
							style={{
								fill: 'white',
								fontSize: 32,
								fontWeight: 'bold',
								align: 'center',
							} as TextStyle}
							x={stageSize.width / 2}
							y={stageSize.height / 2 - 50}
							anchor={[0.5, 0.5]}
							scale={1}
						/>
						<Button
							x={stageSize.width / 2 - 145}
							y={stageSize.height / 2}
							width={120}
							height={60}
							label="Exit"
							color={0xAA2222}
							radius={8}
							onClick={() => router.push('/projects')}
						/>
						<Button
							x={stageSize.width / 2 + 25}
							y={stageSize.height / 2}
							width={120}
							height={60}
							label="Cancel"
							radius={8}
							onClick={() => setShowExitModal(false)}
						/>
					</Container>
				)
			}

			{showPuzzleCompleteModal && (
				<PuzzleCompleteModal
					x={0}
					y={0}
					width={stageSize.width}
					height={stageSize.height}
					closeModal={() => setShowPuzzleCompleteModal(false)}
					openSettings={() => setShowSettingsModal(true)}
				/>
			)}

			{showSettingsModal && (
				<SettingsModal
					x={0}
					y={0}
					width={stageSize.width}
					height={stageSize.height}
					setShowSettingsModal={setShowSettingsModal}
				/>
			)}

			<Cursor />
		</ViewportContext.Provider>
	);
}
