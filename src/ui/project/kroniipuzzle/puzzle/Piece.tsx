'use client';

import React, {
	useEffect, useImperativeHandle, useRef, useState,
} from 'react';
import { Container, Sprite, Text } from '@pixi/react';
import {
	DisplayObject, Sprite as PixiSprite, TextStyle, Texture, Container as PixiContainer,
} from 'pixi.js';
import Message from './Message';
import PieceInfo from './PieceInfo';
import {
	COL_COUNT, PIECE_MARGIN, PIECE_SIZE, ROW_COUNT,
} from './PuzzleConfig';
import usePuzzleStore from './PuzzleStore';

interface PieceProps {
	c: number;
	r: number;
	texture: Texture;
	setSelectedPiece: (piece: PieceInfo) => void;
	message?: Message;
	kronie?: PixiSprite;
}

export type IsNearAdjacentPieceRes = {
	near: false;
} | {
	near: true;
	data: {
		x: number;
		y: number;
		side: 'left' | 'top' | 'right' | 'bottom';
		groupKey: string;
	}
};

export interface PieceActions {
	isNearAdjacentPiece(): IsNearAdjacentPieceRes;
	updateGlobalPosition(): void;
	updateLocalPosition(newPosition: { x: number, y: number }): void;
}

/* TODO:
	- Change interaction handlers:
		- Add click handler to select this piece to show the message
 */

const Piece = React.forwardRef<PieceActions, PieceProps>(({
	c,
	r,
	texture,
	setSelectedPiece,
	message,
	kronie,
}, ref) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [isRead, setIsRead] = useState(false);

	const pieceContainerRef = useRef<PixiContainer<DisplayObject> | null>(null);

	/* eslint-disable @typescript-eslint/no-unused-vars */
	// Use refs to not trigger re-renders every time these update
	const thisPiece = usePuzzleStore((state) => state.pieces[`${r}-${c}`]);
	const pieceLeft = useRef(c !== 0 && usePuzzleStore.getState().pieces[`${r}-${c - 1}`]);
	const pieceTop = useRef(r !== 0 && usePuzzleStore.getState().pieces[`${r - 1}-${c}`]);
	const pieceRight = useRef(c !== COL_COUNT - 1 && usePuzzleStore.getState().pieces[`${r}-${c + 1}`]);
	const pieceBottom = useRef(r !== ROW_COUNT - 1 && usePuzzleStore.getState().pieces[`${r + 1}-${c}`]);
	const [updatePiecePosition, updatePieceLocalPosition] = usePuzzleStore((state) => [state.updatePiecePosition(`${r}-${c}`), state.updatePieceLocalPosition]);
	/* eslint-enable */

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

	function updateGlobalPosition() {
		const container = pieceContainerRef.current!;
		const calcPos = container.parent!.parent!.toLocal(container.position, container.parent!);
		updatePiecePosition({
			x: calcPos.x,
			y: calcPos.y,
		});
	}

	function updateLocalPosition(newPos: { x: number, y: number }) {
		updatePieceLocalPosition(`${r}-${c}`, newPos);
	}

	function isNearPosition(current: any, target: any) {
		const currentX = current.position.x;
		const currentY = current.position.y;
		const targetX = target.position.x;
		const targetY = target.position.y;

		// todo: check this logic. probably too contrived to work consistently for all resolutions
		const deltaX = Math.abs(currentX - targetX);
		const deltaY = Math.abs(currentY - targetY);
		return deltaX < 100 && deltaY < 100;
	}

	// TODO: Has some bugs? Snaps while not being near at all.
	function isNearAdjacentPiece(): IsNearAdjacentPieceRes {
		const nearData: any = {
			near: false,
		};

		if (
			pieceLeft.current
			&& isNearPosition(
				thisPiece,
				pieceLeft.current,
			)
			&& thisPiece.pieceGroup !== pieceLeft.current.pieceGroup
		) {
			nearData.near = true;
			nearData.data = {
				x: pieceLeft.current.localPosition.x,
				y: pieceLeft.current.localPosition.y,
				side: 'left',
				groupKey: pieceLeft.current.pieceGroup,
			};
		} else if (
			pieceTop.current
			&& isNearPosition(
				thisPiece,
				pieceTop.current,
			)
			&& thisPiece.pieceGroup !== pieceTop.current.pieceGroup
		) {
			nearData.near = true;
			nearData.data = {
				x: pieceTop.current.localPosition.x,
				y: pieceTop.current.localPosition.y,
				side: 'top',
				groupKey: pieceTop.current.pieceGroup,
			};
		} else if (
			pieceRight.current
			&& isNearPosition(
				thisPiece,
				pieceRight.current,
			)
			&& thisPiece.pieceGroup !== pieceRight.current.pieceGroup
		) {
			nearData.near = true;
			nearData.data = {
				x: pieceRight.current.localPosition.x,
				y: pieceRight.current.localPosition.y,
				side: 'right',
				groupKey: pieceRight.current.pieceGroup,
			};
		} else if (
			pieceBottom.current
			&& isNearPosition(
				thisPiece,
				pieceBottom.current,
			)
			&& thisPiece.pieceGroup !== pieceBottom.current.pieceGroup
		) {
			nearData.near = true;
			nearData.data = {
				x: pieceBottom.current.localPosition.x,
				y: pieceBottom.current.localPosition.y,
				side: 'bottom',
				groupKey: pieceBottom.current.pieceGroup,
			};
		}

		return nearData;
	}

	useImperativeHandle(ref, () => ({
		isNearAdjacentPiece,
		updateGlobalPosition,
		updateLocalPosition,
	}));

	// TODO: Something breaks badly when interaction is enabled on pieces, idk what
	return (
		<Container
			x={thisPiece.localPosition.x}
			y={thisPiece.localPosition.y}
			// "auto" means non-interactive, "static" means interactive
			eventMode="auto"
			onpointertap={() => {
				setSelectedPiece({
					message,
					sprite: kronie,
				} as PieceInfo);
			}}
			ref={pieceContainerRef}
		>

			<Sprite
				texture={texture}
				x={-PIECE_MARGIN}
				y={-PIECE_MARGIN}
				width={PIECE_SIZE + 2 * PIECE_MARGIN}
				height={PIECE_SIZE + 2 * PIECE_MARGIN}
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
});

Piece.displayName = 'Piece';
export default Piece;
