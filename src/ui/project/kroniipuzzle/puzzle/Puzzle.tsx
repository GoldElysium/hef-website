/* eslint-disable react/no-array-index-key */
import React, { useCallback, useEffect, useState } from 'react';
import * as PIXI from 'pixi.js';
import {
	Container, Graphics,
} from '@pixi/react';
import { Rectangle, Texture } from 'pixi.js';
import Piece from './Piece';

interface PuzzleProps {
	x: number;
	y: number;
	width: number;
	height: number;
	puzzleFinished: () => void;
	onPieceSelected: (piece: any) => void;
}

// eslint-disable-next-line react/function-component-definition
const Puzzle: React.FC<PuzzleProps> = ({
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	x, y, width, height, puzzleFinished, onPieceSelected,
}) => {
	const numCols = 18;
	const numRows = 9;
	const numPieces = numCols * numRows;
	const pieceWidth = width / numCols;

	const imageUrl = '/assets/kroniipuzzle/puzzle.png';
	const texture = Texture.from(imageUrl);

	const puzzlePieces: JSX.Element[][] = [];
	const newPuzzlePieces: JSX.Element[] = [];

	const [count, setCount] = useState(0);

	const [dummyMessages, setDummyMessages] = useState([] as string[]);

	useEffect(() => {
		const fetchMessages = async () => {
			try {
				const totalResponses = 648;
				const responsesPerCall = 100;
				const numCalls = Math.ceil(totalResponses / responsesPerCall);
				const allResponses: any[] | ((prevState: string[]) => string[]) = [];

				const fetchPromises = [];

				for (let i = 0; i < numCalls; i++) {
					let paras = responsesPerCall;
					if (i === numCalls - 1) {
						paras = totalResponses - (responsesPerCall * i);
					}
					const promise = fetch(
						`https://baconipsum.com/api/?type=all-meat&paras=${paras}&start-with-lorem=1`,
					)
						.then((response) => response.json())
						.then((result) => {
							allResponses.push(...result);
						});

					fetchPromises.push(promise);
				}

				await Promise.all(fetchPromises);

				setDummyMessages(allResponses);
			} catch (error) {
				console.error('Error fetching data:', error);
			}
		};

		fetchMessages();
	}, []);

	const incrementCountAndCheckPuzzleFinished = useCallback(() => {
		const newCount = count + 1;
		setCount(newCount);
		if (newCount >= numPieces) {
			puzzleFinished();
		}
	}, [count]);

	const drawPuzzleContainer = useCallback((g: PIXI.Graphics) => {
		g.lineStyle(2, 0xffffff);

		g.drawRect(
			0,
			0,
			width,
			height,
		);
	}, [height, width]);

	if (dummyMessages.length === 0) {
		return null;
	}

	for (let r = 0; r < numRows; r++) {
		const row: JSX.Element[] = [];
		for (let c = 0; c < numCols; c++) {
			const message = dummyMessages[r * numCols + c];
			const piece = dummyMessages.length > 0 && (
				<Piece
					key={`piece-${r}-${c}`}
					c={c}
					r={r}
					numCols={numCols}
					numRows={numRows}
					pieceSize={pieceWidth}
					texture={new Texture(
						texture.baseTexture,
						new Rectangle(
							c * (texture.width / numCols),
							r * (texture.height / numRows),
							texture.width / numCols,
							texture.height / numRows,
						),
					)}
					incrementCountAndCheckPuzzleFinished={incrementCountAndCheckPuzzleFinished}
					setSelectedPiece={onPieceSelected}
					message={message}
				/>
			);
			if (!piece) {
				return null;
			}
			row.push(piece);
			newPuzzlePieces.push(piece);
		}
		puzzlePieces.push(row);
	}

	return (
		<Container x={x} y={y} sortableChildren>
			<Graphics
				width={width}
				height={height}
				draw={(g) => {
					g.clear();
					drawPuzzleContainer(g);
				}}
			/>
			{newPuzzlePieces}
		</Container>
	);
};

export default Puzzle;
