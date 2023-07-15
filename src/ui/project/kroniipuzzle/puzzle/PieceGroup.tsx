'use client';

import { Container } from '@pixi/react';
import { useContext, useState } from 'react';
import { FederatedPointerEvent } from 'pixi.js';
import usePuzzleStore from './PuzzleStore';
import { PIECE_SIZE } from './PuzzleConfig';
import ViewportContext from '../providers/ViewportContext';

interface PieceGroupProps {
	groupKey: string;
	pieces: Record<string, JSX.Element>;
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
	const [updatePieceGroupPosition, setCorrect] = usePuzzleStore(
		(state) => [state.updatePieceGroupPosition(groupKey), state.setCorrect(groupKey)],
	);
	/* eslint-enable */

	const handleDragStart = (event: FederatedPointerEvent) => {
		if (dragging || thisPieceGroup.correct) {
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

		// TODO: get position accounting for drag start position
		const newPos = { x: x - PIECE_SIZE / 2, y: y - PIECE_SIZE / 2 };
		setCurrentPosition(newPos);
		updatePieceGroupPosition(newPos);

		setDragging(false);
		setDisableDragging(false);
	};

	/* TODO:
		- On drag end:
			- Update the position of every piece
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
			{/* */}
		</Container>
	);
}
