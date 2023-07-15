'use client';

import {
	useContext, useEffect, useRef, useState,
} from 'react';
import { Container, Sprite, Text } from '@pixi/react';
import {
	FederatedPointerEvent, Sprite as PixiSprite, TextStyle, Texture,
} from 'pixi.js';
import ViewportContext from '../providers/ViewportContext';
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
		- Remove drag handlers
		- Add click handler to select this piece to show the message
	- Change currentPosition to position inside pieceGroup container
	- Position in Zustand store is global, for snapping
 */

// eslint-disable-next-line react/function-component-definition
const Piece: React.FC<PieceProps> = ({
	c,
	r,
	texture,
	incrementCountAndCheckPuzzleFinished,
	setSelectedPiece,
	message,
	kronie,
}) => {
	function getInitialPosX(): number {
		return Math.floor(Math.random() * PIECE_SIZE * COL_COUNT);
	}

	function getInitialPosY(): number {
		return Math.floor(Math.random() * PIECE_SIZE * ROW_COUNT);
	}

	function extrapolatePos(index: number): number {
		return index * PIECE_SIZE;
	}

	const [dragging, setDragging] = useState(false);
	const [currentPosition, setCurrentPosition] = useState({ x: -1000, y: -1000 });
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [targetPosition, setTargetPosition] = useState({
		x: extrapolatePos(c),
		y: extrapolatePos(r),
	});
	const [lastUpdatedAt, setLastUpdatedAt] = useState(Date.now());
	const [parent, setParent] = useState(null as any);
	const { setDisableDragging } = useContext(ViewportContext);
	const [settled, setSettled] = useState(false);
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
			x: getInitialPosX(),
			y: getInitialPosY(),
		};

		setCurrentPosition(initialPosition);
		updatePiecePosition(initialPosition);
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

	function isNearSidePiece(x: number, y: number): boolean {
		let isNear = false;

		if (pieceLeft.current
			&& isNearPosition(x, y, pieceLeft.current.position.x, pieceLeft.current.position.y)) {
			isNear = true;
			// TODO: Snap
		}

		return isNear;
	}

	const handleDragStart = (event: FederatedPointerEvent) => {
		setSelectedPiece({
			message,
			sprite: kronie,
		} as PieceInfo);

		if (dragging || settled) {
			return;
		}

		const tempParent = event.target?.parent;
		if (tempParent != null) {
			setParent(tempParent);
		}
		setDragging(true);
		setDisableDragging(true);
		const now = Date.now();
		setLastUpdatedAt(now);
	};

	const handleDragMove = (event: FederatedPointerEvent) => {
		if (!dragging) {
			return;
		}

		const { x, y } = event.getLocalPosition(parent);
		// todo: get position accounting for drag start position
		setCurrentPosition({ x: x - PIECE_SIZE / 2, y: y - PIECE_SIZE / 2 });
	};

	const handleDragEnd = (event: FederatedPointerEvent) => {
		if (!dragging) {
			return;
		}

		const { x, y } = event.getLocalPosition(parent);

		if (isNearPosition(x, y, targetPosition.x, targetPosition.y)) {
			setSettled(true);
			const newPos = { x: targetPosition.x, y: targetPosition.y };
			setCurrentPosition(newPos);
			updatePiecePosition(newPos);
			setLastUpdatedAt(0);
			incrementCountAndCheckPuzzleFinished();
		} else if (isNearSidePiece(x, y)) {
			//
		} else {
			// todo: get position accounting for drag start position
			const newPos = { x: x - PIECE_SIZE / 2, y: y - PIECE_SIZE / 2 };
			setCurrentPosition(newPos);
			updatePiecePosition(newPos);
		}

		setDragging(false);
		setDisableDragging(false);
	};

	return (
		<Container
			x={currentPosition.x ?? c * PIECE_SIZE}
			y={currentPosition.y ?? r * PIECE_SIZE}
			eventMode="static"
			onpointerdown={handleDragStart}
			onpointermove={handleDragMove}
			onglobalpointermove={handleDragMove}
			onpointerup={handleDragEnd}
			onpointerupoutside={handleDragEnd}
			touchstart={handleDragEnd}
			touchmove={handleDragEnd}
			touchend={handleDragEnd}
			touchendoutside={handleDragEnd}
			zIndex={lastUpdatedAt}
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
