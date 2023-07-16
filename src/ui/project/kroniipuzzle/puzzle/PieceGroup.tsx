'use client';

import { Container } from '@pixi/react';
import React, { useContext, useEffect, useState } from 'react';
import { FederatedPointerEvent } from 'pixi.js';
import usePuzzleStore from './PuzzleStore';
import { COL_COUNT, PIECE_SIZE, ROW_COUNT } from './PuzzleConfig';
import ViewportContext from '../providers/ViewportContext';
import { PieceActions } from './Piece';

interface PieceGroupProps {
	groupKey: string;
	pieces: Record<string, { ref: React.MutableRefObject<PieceActions>, piece: JSX.Element }>;
}

function getInitialPosX(): number {
	return Math.floor(Math.random() * PIECE_SIZE * COL_COUNT);
}

function getInitialPosY(): number {
	return Math.floor(Math.random() * PIECE_SIZE * ROW_COUNT);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function PieceGroup({ groupKey, pieces }: PieceGroupProps) {
	/* eslint-disable @typescript-eslint/no-unused-vars */
	const [dragging, setDragging] = useState(false);
	const [currentPosition, setCurrentPosition] = useState({ x: -1000, y: -1000 });
	const [lastUpdatedAt, setLastUpdatedAt] = useState(Date.now());
	const [parent, setParent] = useState(null as any);
	const { setDisableDragging } = useContext(ViewportContext);

	const thisPieceGroup = usePuzzleStore((state) => state.pieceGroups[groupKey]);
	const [updatePieceGroupPosition, setCorrect,
		updatePieceLocalPosition, changePieceGroup] = usePuzzleStore(
		(state) => [
			state.updatePieceGroupPosition(groupKey),
			state.setCorrect(groupKey),
			state.updatePieceLocalPosition,
			state.changePieceGroup(groupKey),
		],
	);
	/* eslint-enable */

	// Set initial position in store
	useEffect(() => {
		const initialPosition = {
			x: getInitialPosX(),
			y: getInitialPosY(),
		};

		setCurrentPosition(initialPosition);
		updatePieceGroupPosition(initialPosition);
	}, []);

	useEffect(() => {
		// eslint-disable-next-line no-restricted-syntax
		for (const pieceKey of thisPieceGroup.pieces) {
			pieces[pieceKey].ref.current.updateGlobalPosition();
		}
	}, []);

	function isNearPosition(currentX: number, currentY: number, targetX: number, targetY: number) {
		// todo: check this logic. probably too contrived to work consistently for all resolutions
		const deltaX = Math.abs(currentX - targetX);
		const deltaY = Math.abs(currentY - targetY);
		return deltaX < 100 && deltaY < 100;
	}

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
			const newPos = { x: targetPosition.x, y: targetPosition.y };
			setCurrentPosition(newPos);
			updatePieceGroupPosition(newPos);
			setCorrect();
			// eslint-disable-next-line no-restricted-syntax
			for (const pieceKey of thisPieceGroup.pieces) {
				pieces[pieceKey].ref.current.updateGlobalPosition();
			}
		} else {
			let nearData: {
				x: number;
				y: number;
				side: 'left' | 'top' | 'right' | 'bottom';
				groupKey: string;
			} | undefined;
			let nearPieceKey: string;
			// eslint-disable-next-line no-restricted-syntax
			for (const pieceKey of thisPieceGroup.pieces) {
				pieces[pieceKey].ref.current.updateGlobalPosition();
				const nearRes = pieces[pieceKey].ref.current.isNearSidePiece();
				if (nearRes.near) {
					nearData = nearRes.data;
					nearPieceKey = pieceKey;
					break;
				}
			}

			if (nearData) {
				const statePieces = usePuzzleStore.getState().pieces;
				const nearPeace = statePieces[nearPieceKey!];
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

				const deltaX = wantedX - nearPeace.localPosition.x;
				const deltaY = wantedY - nearPeace.localPosition.y;

				const positionData: Record<string, { x: number, y: number }> = {};
				// eslint-disable-next-line no-restricted-syntax
				for (const pieceKey of thisPieceGroup.pieces) {
					positionData[pieceKey] = {
						x: deltaX + statePieces[pieceKey].localPosition.x,
						y: deltaY + statePieces[pieceKey].localPosition.y,
					};
				}

				changePieceGroup(nearData.groupKey, positionData);
			} else {
				// TODO: get position accounting for drag start position
				const newPos = { x: x - PIECE_SIZE / 2, y: y - PIECE_SIZE / 2 };
				setCurrentPosition(newPos);
				updatePieceGroupPosition(newPos);
			}
		}

		setDragging(false);
		setDisableDragging(false);
	};

	/* TODO: @GoldElysium
		- On drag end:
			- Update the global position of every piece
			- Check every piece if near side piece, if so, snap to that side piece
			  (What do we do if multiple pieces are close? Since this could cause some nasty
			  movement for snapping, or the snap distance needs to be significantly lowered)
			- Check for a single piece if it's near the target position, if so, then everything is
			  and should snap to the correct position.
	*/

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
