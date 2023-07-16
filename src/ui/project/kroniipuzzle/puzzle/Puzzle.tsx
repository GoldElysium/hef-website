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
import { COL_COUNT, PIECE_COUNT, ROW_COUNT } from './PuzzleConfig';
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

export default function Puzzle({
	// @ts-ignore
	x, y, width, height, puzzleFinished, onPieceSelected, submissions,
}: PuzzleProps) {
	const [assetBundle, setAssetBundle] = useState<null | any>(null);
	const [piecesBundle, setPiecesBundle] = useState<null | any>(null);

	const puzzlePieces: Record<string, { ref: React.MutableRefObject<any>, piece: JSX.Element }> = {};

	const [count, setCount] = useState(0);

	const pieceGroups = usePuzzleStore((state) => state.pieceGroups);

	const incrementCountAndCheckPuzzleFinished = useCallback(() => {
		const newCount = count + 1;
		setCount(newCount);
		if (newCount >= PIECE_COUNT) {
			puzzleFinished();
		}
	}, [count]);

	const drawPuzzleContainer = useCallback((g: PIXI.Graphics) => {
		g.clear();
		g.lineStyle(2, 0xffffff);
		console.log('Redrawing container');

		g.drawRect(
			0,
			0,
			width,
			height,
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
					incrementCountAndCheckPuzzleFinished={incrementCountAndCheckPuzzleFinished}
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
				draw={drawPuzzleContainer}
			/>
			{Object.keys(pieceGroups).map((groupKey) => (
				<PieceGroup
					key={groupKey}
					groupKey={groupKey}
					pieces={puzzlePieces}
				/>
			))}
		</Container>
	);
}
