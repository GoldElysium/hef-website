/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable class-methods-use-this */
/**
 * A piece of the puzzle
 *
 * contains an image that can be "zoomed"
 * contains a "kronie message"
 *
 * starts out at a random spot on the puzzle
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class Piece {
	// contains references to image thumb and full
	img: Img | undefined;

	// kronie message
	message: string | undefined;

	// floats for current position of piece.
	// randomized on initialization
	currentPosX: number;

	currentPosY: number;

	// floats for target position of piece.
	// based on index on puzzle
	targetPosX: number;

	targetPosY: number;

	// timestamp used to determine how the pieces overlap
	lastUpdatedAt: Date | undefined;

	/**
   *
   * @param puzzleIndexX integer specifying "x" index on puzzle
   * @param puzzleIndexY integer specifying "y" index on puzzle
   */
	constructor(
		puzzleIndexX: number,
		puzzleIndexY: number,
	) {
		this.targetPosX = this.extrapolatePosX(puzzleIndexX);
		this.targetPosY = this.extrapolatePosY(puzzleIndexY);

		this.currentPosX = this.getInitialPosX();
		this.currentPosY = this.getInitialPosY();
	}

	/**
   * random position on the puzzle within X bounds
   */
	getInitialPosX(): number {
		// todo
		return 0;
	}

	/**
   * random position on the puzzle within Y bounds
   */
	getInitialPosY(): number {
		// todo
		return 0;
	}

	/**
   *
   * @param puzzleIndexX matrix index on the puzzle
   * @returns float position based on the puzzle index
   */
	extrapolatePosX(puzzleIndexX: number): number {
		// todo
		return 0;
	}

	/**
   *
   * @param puzzleIndexY matrix index on the puzzle
   * @returns float position based on the puzzle index
   */
	extrapolatePosY(puzzleIndexX: number): number {
		// todo
		return 0;
	}
}

export default Piece;
