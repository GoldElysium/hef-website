'use client';

import { Container } from '@pixi/react';
import React, { useContext, useEffect, useState } from 'react';
import { FederatedPointerEvent } from 'pixi.js';
import usePuzzleStore from './PuzzleStore';
import { PIECE_SIZE } from './PuzzleConfig';
import ViewportContext from '../providers/ViewportContext';
import { PieceActions } from './Piece';

interface PieceGroupProps {
	groupKey: string;
	pieces: Record<string, { ref: React.MutableRefObject<PieceActions>, piece: JSX.Element }>;
	initialX: number;
	initialY: number;
	playTick: () => void;
	playTock: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function PieceGroup({
	groupKey, pieces, initialX, initialY, playTick, playTock,
}: PieceGroupProps) {
	/* eslint-disable @typescript-eslint/no-unused-vars */
	const [dragging, setDragging] = useState(false);
	const [currentPosition, setCurrentPosition] = useState({ x: initialX, y: initialY });
	const [lastUpdatedAt, setLastUpdatedAt] = useState(Date.now());
	const [parent, setParent] = useState(null as any);
	const { setDisableDragging } = useContext(ViewportContext);

	const thisPieceGroup = usePuzzleStore((state) => state.pieceGroups[groupKey]);
	const [
		updatePieceGroupPosition,
		setCorrect,
		changePieceGroup,
	] = usePuzzleStore(
		(state) => [
			state.updatePieceGroupPosition(groupKey),
			state.setCorrect(groupKey),
			state.changePieceGroup(groupKey),
		],
	);
	/* eslint-enable */

	// Set initial position in store
	useEffect(() => {
		const initialPosition = {
			x: initialX,
			y: initialY,
		};

		setCurrentPosition(initialPosition);
		updatePieceGroupPosition(initialPosition);
	}, [initialX, initialY]);

	useEffect(() => {
		// eslint-disable-next-line no-restricted-syntax
		for (const pieceKey of thisPieceGroup.pieces) {
			pieces[pieceKey].ref.current.updateGlobalPosition();
		}
	}, []);

	const isNearPosition = (currentX: number, currentY: number, targetX: number, targetY: number) => {
		// todo: check this logic. probably too contrived to work consistently for all resolutions
		const deltaX = Math.abs(currentX - targetX);
		const deltaY = Math.abs(currentY - targetY);
		return deltaX < 100 && deltaY < 100;
	};

	const notNearTargetPositionLogic = (x: number, y: number) => {
		let nearData: {
			x: number;
			y: number;
			side: 'left' | 'top' | 'right' | 'bottom';
			groupKey: string;
		} | undefined;
		let nearPieceKey: string;
		const statePieces = usePuzzleStore.getState().pieces;

		// eslint-disable-next-line no-restricted-syntax
		for (const pieceKey of thisPieceGroup.pieces) {
			const piece = pieces[pieceKey].ref.current;
			piece.updateGlobalPosition();
			const nearRes = piece.isNearAdjacentPiece();
			if (nearRes.near) {
				if (nearRes.data.groupKey === statePieces[pieceKey].pieceGroup) {
					console.log(`encountered same group key when checking nearness. skipping. ${nearRes.data.groupKey}`);
					// eslint-disable-next-line no-continue
					continue;
				}
				nearData = nearRes.data;
				nearPieceKey = pieceKey;
				break;
			}
		}

		if (!nearData) {
			// TODO: get position accounting for drag start position
			const newPos = { x: x - PIECE_SIZE / 2, y: y - PIECE_SIZE / 2 };
			setCurrentPosition(newPos);
			updatePieceGroupPosition(newPos);

			playTock();
			return;
		}

		const nearPiece = statePieces[nearPieceKey!];
		let wantedX = nearData.x;

		if (nearData.side === 'left') {
			wantedX += PIECE_SIZE;
		} else if (nearData.side === 'right') {
			wantedX -= PIECE_SIZE;
		}

		let wantedY = nearData.y;
		if (nearData.side === 'top') {
			wantedY += PIECE_SIZE;
		} else if (nearData.side === 'bottom') {
			wantedY -= PIECE_SIZE;
		}

		const deltaX = wantedX - nearPiece.localPosition.x;
		const deltaY = wantedY - nearPiece.localPosition.y;

		const positionData: Record<string, { x: number; y: number; }> = {};
		// eslint-disable-next-line no-restricted-syntax
		for (const pieceKey of thisPieceGroup.pieces) {
			positionData[pieceKey] = {
				x: deltaX + statePieces[pieceKey].localPosition.x,
				y: deltaY + statePieces[pieceKey].localPosition.y,
			};
		}

		const newGroupKey = nearData.groupKey;

		changePieceGroup(newGroupKey, positionData);

		playTick();
	};

	const settlePieceGroup = (targetPosition: { x: number, y: number }) => {
		const newPos = { x: targetPosition.x, y: targetPosition.y };
		setCurrentPosition(newPos);
		updatePieceGroupPosition(newPos);
		setCorrect();
		// Force to background when correct, otherwise can interfere with other pieces behind it
		setLastUpdatedAt(-1);
		// eslint-disable-next-line no-restricted-syntax
		for (const pieceKey of thisPieceGroup.pieces) {
			pieces[pieceKey].ref.current.updateGlobalPosition();
		}

		playTick();
	};

	const handleDragStart = (event: FederatedPointerEvent) => {
		if (dragging || thisPieceGroup.correct) {
			return;
		}

		const tempParent = event.target!.parent!;
		if (tempParent != null) {
			setParent(tempParent);
		}
		setDragging(true);
		setDisableDragging(true);
		const now = Date.now();
		setLastUpdatedAt(now);
		playTick();
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
		const { targetPosition } = thisPieceGroup;

		// Check if near target
		if (isNearPosition(x, y, targetPosition.x, targetPosition.y)) {
			settlePieceGroup(targetPosition);
		} else {
			notNearTargetPositionLogic(x, y);
		}

		setDragging(false);
		setDisableDragging(false);
	};

	return (
		<Container
			x={currentPosition.x}
			y={currentPosition.y}
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
			{thisPieceGroup.pieces.map((pieceKey) => pieces[pieceKey].piece)}
		</Container>
	);
}
