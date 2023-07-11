/* eslint-disable react/no-array-index-key */
import React, { useCallback, useState } from 'react';
import * as PIXI from 'pixi.js';
import {
	Container, Graphics,
} from '@pixi/react';
import { Texture } from 'pixi.js';
import Piece from './Piece';

interface PuzzleProps {
	x: number;
	y: number;
	width: number;
	height: number;
	puzzleFinished: () => void;
}

// eslint-disable-next-line react/function-component-definition
const Puzzle: React.FC<PuzzleProps> = ({
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	x, y, width, height, puzzleFinished,
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

	for (let r = 0; r < numRows; r++) {
		const row: JSX.Element[] = [];
		for (let c = 0; c < numCols; c++) {
			const piece = (
				<Piece
					key={`piece-${r}-${c}`}
					c={c}
					r={r}
					numCols={numCols}
					numRows={numRows}
					pieceSize={pieceWidth}
					texture={texture}
					incrementCountAndCheckPuzzleFinished={incrementCountAndCheckPuzzleFinished}
				/>
			);
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
