'use client';

/* eslint-disable react/no-array-index-key */
import React, {
	useCallback, useEffect, useRef, useState,
} from 'react';
import * as PIXI from 'pixi.js';
import { Sprite as PixiSprite } from 'pixi.js';
import { Container, Graphics } from '@pixi/react';
import Piece, { PieceActions } from './Piece';
import Message from './Message';
import PieceInfo from './PieceInfo';
import {
	COL_COUNT, PIECE_COUNT, PIECE_SIZE, ROW_COUNT,
} from './PuzzleConfig';
import usePuzzleStore from './PuzzleStore';
import PieceGroup from './PieceGroup';

interface PuzzleProps {
	x: number;
	y: number;
	width: number;
	height: number;
	puzzleFinished: () => void;
	onPieceSelected: (piece: PieceInfo) => void;
	submissions: Message[];
}

function flatIndexToSpiralCoordinates(index: number): [number, number] | null {
	// todo: these are hard-coded. possibly need to change
	const centerRow = Math.ceil(ROW_COUNT / 3);
	const centerCol = Math.ceil(COL_COUNT / 8);

	let x = centerCol;
	let y = centerRow;
	let dx = 1;
	let dy = 0;
	const initialSideLength = 13;
	let sideLength = initialSideLength;
	let stepsInSide = 0;
	let currentIndex = 0;

	while (currentIndex < index) {
		x += dx;
		y += dy;
		currentIndex += 1;

		stepsInSide += 1;

		if (stepsInSide >= sideLength) {
			if (dx === 1 && dy === 0) {
				// Right to Down
				dx = 0;
				dy = 1;
				sideLength -= initialSideLength - 1;
			} else if (dx === 0 && dy === 1) {
				// Down to Left
				dx = -1;
				dy = 0;
				sideLength += initialSideLength;
			} else if (dx === -1 && dy === 0) {
				// Left to Up
				dx = 0;
				dy = -1;
				sideLength -= initialSideLength - 1;
			} else if (dx === 0 && dy === -1) {
				// Up to Right
				dx = 1;
				dy = 0;
				sideLength += initialSideLength;
			}

			stepsInSide = 0;
		}
	}

	if (currentIndex === index) {
		return [x, y];
	}

	return null;
}

export default function Puzzle({
	// @ts-ignore
	x, y, width, height, puzzleFinished, onPieceSelected, submissions,
}: PuzzleProps) {
	const [assetBundle, setAssetBundle] = useState<null | any>(null);
	const [piecesBundle, setPiecesBundle] = useState<null | any>(null);

	const puzzlePieces: Record<string, { ref: React.MutableRefObject<any>, piece: JSX.Element }> = {};

	const correctCount = usePuzzleStore((state) => state.correctCount);
	const pieceGroups = usePuzzleStore((state) => state.pieceGroups);

	useEffect(() => {
		if (correctCount >= PIECE_COUNT) {
			puzzleFinished();
		}
	}, [correctCount]);

	// todo: this should be drawn under the puzzle
	// todo: the rect width and height don't seem consisten between renders at page refresh?
	const drawPuzzleBounds = useCallback((g: PIXI.Graphics) => {
		const lineWidth = 6;
		g.clear();
		g.lineStyle(lineWidth, 0xffffff);
		console.log('Redrawing container');

		g.drawRect(
			lineWidth / 2,
			lineWidth / 2,
			width + lineWidth,
			height + lineWidth,
		);
	}, [height, width]);

	useEffect(() => {
		PIXI.Assets.loadBundle('puzzle')
			.then((loadedBundle) => {
				setAssetBundle(loadedBundle);
			});

		PIXI.Assets.loadBundle('pieces')
			.then((loadedBundle) => {
				setPiecesBundle(loadedBundle);
			});
	}, []);
	for (let r = 0; r < ROW_COUNT; r++) {
		for (let c = 0; c < COL_COUNT; c++) {
			puzzlePieces[`${r}-${c}`] = {
				// eslint-disable-next-line react-hooks/rules-of-hooks
				ref: useRef<PieceActions>(),
				piece: null as any,
			};
		}
	}

	if (!assetBundle || !piecesBundle) return null;

	for (let r = 0; r < ROW_COUNT; r++) {
		for (let c = 0; c < COL_COUNT; c++) {
			// TODO: Remove this type coercion in prod
			const message = submissions[r * COL_COUNT + c] as unknown as string;

			const words = message.split(' ');
			const midpoint = Math.floor(words.length / 2);

			const congrats = words.slice(0, midpoint).join(' ');
			const congratulations = congrats + (congrats[congrats.length - 1] !== '.' ? '.' : '');
			const f = words.slice(midpoint).join(' ');
			const favoriteMoment = f.charAt(0).toUpperCase() + f.slice(1);
			const kronie = new PixiSprite(assetBundle.kronie);

			// todo: this doesn't stick for some reason. not really an issue though
			// since the tinting is just for debug purposes
			kronie.tint = new PIXI.Color([Math.random(), Math.random(), Math.random()]);

			// eslint-disable-next-line react-hooks/rules-of-hooks
			const pieceRef = puzzlePieces[`${r}-${c}`].ref;

			const piece = (
				<Piece
					key={`piece-${r}-${c}`}
					c={c}
					r={r}
					texture={piecesBundle[`${r}-${c}`]}
					setSelectedPiece={onPieceSelected}
					message={{
						from: `${c}_${r}`,
						congratulations,
						favoriteMoment,
						isRead: false,
					} satisfies Message}
					kronie={kronie}
					ref={pieceRef}
				/>
			);
			if (!piece) {
				return null;
			}
			puzzlePieces[`${r}-${c}`] = {
				ref: pieceRef,
				piece,
			};
		}
	}

	return (
		<Container x={x} y={y} sortableChildren>
			<Graphics
				width={width}
				height={height}
				draw={drawPuzzleBounds}
			/>
			{Object.entries(pieceGroups)
				/* eslint-disable @typescript-eslint/no-unused-vars */
				.map(([groupKey, pieceGroup]) => {
					const coords = flatIndexToSpiralCoordinates(
						pieceGroup.randomIndex + (Math.floor(PIECE_COUNT * 0.6) - 10),
					);
					const [c, r] = coords || [0, 0];

					return (
						<PieceGroup
							key={groupKey}
							groupKey={groupKey}
							pieces={puzzlePieces}
							// todo: the adjustment of + and - PIECE_SIZE need tweaking
							initialX={c * PIECE_SIZE * 1.5 + PIECE_SIZE}
							initialY={r * PIECE_SIZE * 1.5 - PIECE_SIZE}
						/>
					);
				})}
		</Container>
	);
}
