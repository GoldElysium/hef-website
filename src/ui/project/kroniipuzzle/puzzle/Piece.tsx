'use client';

import React, { useEffect, useImperativeHandle, useRef } from 'react';
import { Container, Sprite } from '@pixi/react';
import { Container as PixiContainer, DisplayObject, Texture } from 'pixi.js';
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
	checkIsSelectedPiece(pos: { x: number, y:number }): boolean;
}

const Piece = React.forwardRef<PieceActions, PieceProps>(({
	c,
	r,
	texture,
	setSelectedPiece,
	message,
}, ref) => {
	const pieceContainerRef = useRef<PixiContainer<DisplayObject> | null>(null);

	/* eslint-disable @typescript-eslint/no-unused-vars */
	// Use refs to not trigger re-renders every time these update
	const thisPiece = usePuzzleStore((state) => state.pieces[`${r}-${c}`]);
	const pieceLeft = useRef(c !== 0 && usePuzzleStore.getState().pieces[`${r}-${c - 1}`]);
	const pieceTop = useRef(r !== 0 && usePuzzleStore.getState().pieces[`${r - 1}-${c}`]);
	const pieceRight = useRef(c !== COL_COUNT - 1 && usePuzzleStore.getState().pieces[`${r}-${c + 1}`]);
	const pieceBottom = useRef(r !== ROW_COUNT - 1 && usePuzzleStore.getState().pieces[`${r + 1}-${c}`]);
	const [updatePiecePosition, updatePieceLocalPosition] = usePuzzleStore((state) => [state.updatePiecePosition(`${r}-${c}`), state.updatePieceLocalPosition]);
	const pieceGroups = usePuzzleStore((state) => state.pieceGroups);

	/* eslint-enable */

	// Subscribe to all side pieces
	/* eslint-disable react-hooks/rules-of-hooks,no-return-assign */
	if (c !== 0) {
		useEffect(() => usePuzzleStore.subscribe(
			(state) => (pieceLeft.current = state.pieces[`${r}-${c - 1}`]),
			// eslint-disable-next-line react-hooks/exhaustive-deps
		), []);
	}
	if (r !== 0) {
		useEffect(() => usePuzzleStore.subscribe(
			(state) => (pieceTop.current = state.pieces[`${r - 1}-${c}`]),
			// eslint-disable-next-line react-hooks/exhaustive-deps
		), []);
	}
	if (c !== COL_COUNT - 1) {
		useEffect(() => usePuzzleStore.subscribe(
			(state) => (pieceRight.current = state.pieces[`${r}-${c + 1}`]),
			// eslint-disable-next-line react-hooks/exhaustive-deps
		), []);
	}
	if (r !== ROW_COUNT - 1) {
		useEffect(() => usePuzzleStore.subscribe(
			(state) => (pieceBottom.current = state.pieces[`${r + 1}-${c}`]),
			// eslint-disable-next-line react-hooks/exhaustive-deps
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

	function isNearPosition(current: any, target: any, dir: string) {
		let xShift = 0;
		let yShift = 0;

		switch (dir) {
			case 'left':
				xShift = -PIECE_MARGIN;
				break;
			case 'right':
				xShift = PIECE_MARGIN;
				break;
			case 'top':
				yShift = -PIECE_MARGIN;
				break;
			case 'bottom':
				yShift = PIECE_MARGIN;
				break;
			default: break;
		}

		const currentX = current.position.x + PIECE_SIZE / 2 + xShift;
		const currentY = current.position.y + PIECE_SIZE / 2 + yShift;
		const targetX = target.position.x + PIECE_SIZE / 2 - xShift;
		const targetY = target.position.y + PIECE_SIZE / 2 - yShift;

		const deltaX = Math.abs(currentX - targetX);
		const deltaY = Math.abs(currentY - targetY);

		return deltaX < 10 && deltaY < 10;
	}

	function isNearAdjacentPiece(): IsNearAdjacentPieceRes {
		const nearData: any = {
			near: false,
		};

		if (
			pieceLeft.current
			&& !pieceGroups[pieceLeft.current.pieceGroup].correct
			&& isNearPosition(
				thisPiece,
				pieceLeft.current,
				'left',
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
			&& !pieceGroups[pieceTop.current.pieceGroup].correct
			&& isNearPosition(
				thisPiece,
				pieceTop.current,
				'top',
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
			&& !pieceGroups[pieceRight.current.pieceGroup].correct
			&& isNearPosition(
				thisPiece,
				pieceRight.current,
				'right',
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
			&& !pieceGroups[pieceBottom.current.pieceGroup].correct
			&& isNearPosition(
				thisPiece,
				pieceBottom.current,
				'bottom',
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

	function checkIsSelectedPiece(pos: { x: number, y: number }): boolean {
		if (!pieceContainerRef.current) return false;

		const localPos = pieceContainerRef.current!.toLocal(pos);

		if ((localPos.x >= 5 && localPos.x <= 50) && (localPos.y >= 5 && localPos.y <= 50)) {
			setSelectedPiece({
				id: `${r}-${c}`,
				message,
			} as PieceInfo);
			return true;
		}

		return false;
	}

	useImperativeHandle(ref, () => ({
		isNearAdjacentPiece,
		updateGlobalPosition,
		updateLocalPosition,
		checkIsSelectedPiece,
	}));

	return (
		<Container
			x={thisPiece.localPosition.x}
			y={thisPiece.localPosition.y}
			ref={pieceContainerRef}
		>
			<Sprite
				texture={texture}
				x={-PIECE_MARGIN}
				y={-PIECE_MARGIN}
				width={PIECE_SIZE + 2 * PIECE_MARGIN}
				height={PIECE_SIZE + 2 * PIECE_MARGIN}
			/>
		</Container>
	);
});

Piece.displayName = 'Piece';
export default Piece;
