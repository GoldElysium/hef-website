'use client';

import { useEffect, useRef, useState } from 'react';
import { Container, Sprite, Text } from '@pixi/react';
import { Sprite as PixiSprite, TextStyle, Texture } from 'pixi.js';
import Message from './Message';
import PieceInfo from './PieceInfo';
import { COL_COUNT, PIECE_SIZE, ROW_COUNT } from './PuzzleConfig';
import usePuzzleStore from './PuzzleStore';

interface PieceProps {
	c: number;
	r: number;
	texture: Texture;
	incrementCountAndCheckPuzzleFinished: () => void;
	setSelectedPiece: (piece: PieceInfo) => void;
	message?: Message;
	kronie?: PixiSprite;
}

/* TODO:
	- Change interaction handlers:
		- Add click handler to select this piece to show the message
	- Change currentPosition to position inside pieceGroup container
	- On snap, update global and local position in the store
 */

// eslint-disable-next-line react/function-component-definition
const Piece: React.FC<PieceProps> = ({
	c,
	r,
	texture,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	incrementCountAndCheckPuzzleFinished,
	setSelectedPiece,
	message,
	kronie,
}) => {
	function extrapolatePos(index: number): number {
		return index * PIECE_SIZE;
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [currentPosition, setCurrentPosition] = useState({ x: 0, y: 0 });
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [targetPosition, setTargetPosition] = useState({
		x: extrapolatePos(c),
		y: extrapolatePos(r),
	});
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [isRead, setIsRead] = useState(false);

	/* eslint-disable @typescript-eslint/no-unused-vars */
	// Use refs to not trigger re-renders every time these update
	const thisPiece = usePuzzleStore((state) => state.pieces[`${r}-${c}`]);
	const pieceLeft = useRef(c !== 0 && usePuzzleStore.getState().pieces[`${r}-${c - 1}`]);
	const pieceTop = useRef(r !== 0 && usePuzzleStore.getState().pieces[`${r - 1}-${c}`]);
	const pieceRight = useRef(c !== COL_COUNT - 1 && usePuzzleStore.getState().pieces[`${r}-${c + 1}`]);
	const pieceBottom = useRef(r !== ROW_COUNT - 1 && usePuzzleStore.getState().pieces[`${r + 1}-${c}`]);
	const [updatePiecePosition, changePieceGroup] = usePuzzleStore((state) => [state.updatePiecePosition(`${r}-${c}`), state.changePieceGroup(`${r}-${c}`)]);
	/* eslint-enable */

	// Set initial position in store
	useEffect(() => {
		const initialPosition = {
			x: 0,
			y: 0,
		};

		setCurrentPosition(initialPosition);
		// updatePiecePosition(initialPosition);
	}, []);

	// Subscribe to all side pieces
	/* eslint-disable react-hooks/rules-of-hooks,no-return-assign */
	if (c !== 0) {
		useEffect(() => usePuzzleStore.subscribe(
			(state) => (pieceLeft.current = state.pieces[`${r}-${c - 1}`]),
		), []);
	}
	if (r !== 0) {
		useEffect(() => usePuzzleStore.subscribe(
			(state) => (pieceTop.current = state.pieces[`${r - 1}-${c}`]),
		), []);
	}
	if (c !== COL_COUNT - 1) {
		useEffect(() => usePuzzleStore.subscribe(
			(state) => (pieceRight.current = state.pieces[`${r}-${c + 1}`]),
		), []);
	}
	if (r !== ROW_COUNT - 1) {
		useEffect(() => usePuzzleStore.subscribe(
			(state) => (pieceBottom.current = state.pieces[`${r + 1}-${c}`]),
		), []);
	}
	/* eslint-enable */

	function isNearPosition(currentX: number, currentY: number, targetX: number, targetY: number) {
		// todo: check this logic. probably too contrived to work consistently for all resolutions
		const deltaX = Math.abs(currentX - targetX);
		const deltaY = Math.abs(currentY - targetY);
		return deltaX < 100 && deltaY < 100;
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	function isNearSidePiece(x: number, y: number): boolean {
		let isNear = false;

		if (pieceLeft.current
			&& isNearPosition(x, y, pieceLeft.current.position.x, pieceLeft.current.position.y)) {
			isNear = true;
			// TODO: Snap
		}

		return isNear;
	}

	// TODO: Something breaks badly when interaction is enabled on pieces, idk what
	return (
		<Container
			x={0}
			y={0}
			// "auto" means non-interactive, "static" means interactive
			eventMode="auto"
			onpointertap={() => {
				setSelectedPiece({
					message,
					sprite: kronie,
				} as PieceInfo);
			}}
		>

			<Sprite
				texture={texture}
				x={-PIECE_SIZE / 2}
				y={-PIECE_SIZE / 2}
				width={PIECE_SIZE * 2}
				height={PIECE_SIZE * 2}
			/>
			<Text
				text={`${c}, ${r}`}
				style={{
					fill: 'white',
					fontSize: 25,
				} as TextStyle}
				x={PIECE_SIZE / 4}
				y={PIECE_SIZE / 4}
				scale={0.2}
			/>

		</Container>
	);
};

export default Piece;
