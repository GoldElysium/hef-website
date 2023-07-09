/**
 * this class is for handling puzzle data and holds references to the puzzle pieces
 */

import Piece from './Piece';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
class Puzzle {
	// number of pieces in 2d space
	sizeX: number;

	sizeY: number;

	// matrix containing references to the puzzle pieces
	pieces: Piece[][];

	constructor(pieces: Piece[][]) {
		this.pieces = pieces;

		this.sizeY = pieces.length;
		this.sizeX = pieces[0].length;
	}

	static generate() {
		const numCols = 36;
		const numRows = 18;
		const pieces: Piece[][] = [];

		for (let r = 0; r < numRows; r++) {
			pieces.push([]);
			for (let c = 0; c < numCols; c++) {
				pieces[r].push(new Piece(c, r));
			}
		}

		return new Puzzle(pieces);
	}
}

export default Puzzle;
