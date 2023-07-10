/* eslint-disable react/no-array-index-key */
import React from 'react';
import {
	Container,
} from '@pixi/react';
import { Texture } from 'pixi.js';
import Piece from './Piece';

interface PuzzleProps {
	x: number;
	y: number;
	width: number;
	height: number;
}

// eslint-disable-next-line react/function-component-definition
const Puzzle: React.FC<PuzzleProps> = ({
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	x, y, width, height,
}) => {
	const numCols = 36;
	const numRows = 18;
	const pieceWidth = width / numCols;

	const imageUrl = '/assets/kroniipuzzle/puzzle.png';
	const texture = Texture.from(imageUrl);

	const puzzlePieces: JSX.Element[][] = [];
	const newPuzzlePieces: JSX.Element[] = [];

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
				/>
			);
			row.push(piece);
			newPuzzlePieces.push(piece);
		}
		puzzlePieces.push(row);
	}

	return (
		<Container x={x} y={y} sortableChildren>
			{newPuzzlePieces}
			{/* {puzzlePieces.map((row, r) => (
				<Container key={`row-${r}`}>
					{row.map((piece, c) => (
						<Container key={`piece-${r}-${c}`}>
							{piece}
						</Container>
					))}
				</Container>
			))} */}
		</Container>
	);
};

export default Puzzle;
