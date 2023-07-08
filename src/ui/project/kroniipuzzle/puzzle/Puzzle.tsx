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
	pieces: [Piece[]];

	constructor(pieces: [Piece[]]) {
		this.pieces = pieces;

		this.sizeY = pieces.length;
		this.sizeX = pieces[0].length;
	}

	static generate() {
		const pieces: [Piece[]] = [[]];

		for (let r = 0; r < 18; r++) {
			for (let c = 0; c < 36; c++) {
				pieces[r].push(new Piece(c, r));
			}
			pieces.push([]);
		}

		return new Puzzle(pieces);
	}
}

export default Puzzle;
