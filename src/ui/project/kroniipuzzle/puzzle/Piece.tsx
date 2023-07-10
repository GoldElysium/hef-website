'use client';

/* eslint-disable @typescript-eslint/no-unused-vars */
import { useContext, useState } from 'react';
import {
	Container, Graphics, Sprite, Text,
} from '@pixi/react';
import {
	FederatedPointerEvent, Rectangle, TextStyle, Texture,
} from 'pixi.js';
import ViewportContext from '../providers/ViewportContext';

interface PieceProps {
	c: number;
	r: number;
	numCols: number;
	numRows: number;
	pieceSize: number;
	texture: Texture;
}

// eslint-disable-next-line react/function-component-definition
const Piece: React.FC<PieceProps> = ({
	c, r, numCols, numRows, pieceSize, texture,
}) => {
	const [dragging, setDragging] = useState(false);
	const [currentPosition, setCurrentPosition] = useState({ x: c * pieceSize, y: r * pieceSize });
	const { setDisableDragging } = useContext(ViewportContext);

	const handleDragStart = (event: FederatedPointerEvent) => {
		setDragging(true);
		setDisableDragging(true);
	};

	const handleDragMove = (event: FederatedPointerEvent) => {
		if (dragging) {
			const { x, y } = event.getLocalPosition(event.target.parent! as any);
			setCurrentPosition({ x, y });
		}
	};

	const handleDragEnd = (event: FederatedPointerEvent) => {
		setDragging(false);
		setDisableDragging(false);
		const { x, y } = event.getLocalPosition(event.target.parent! as any);
		setCurrentPosition({ x, y });
	};

	function getInitialPosX(): number {
		// TODO
		return 0;
	}

	function getInitialPosY(): number {
		// TODO
		return 0;
	}

	function extrapolatePosX(index: number): number {
		// TODO
		return 0;
	}

	function extrapolatePosY(index: number): number {
		// TODO
		return 0;
	}

	const targetPosX = extrapolatePosX(c);
	const targetPosY = extrapolatePosY(r);

	const currentPosX = getInitialPosX();
	const currentPosY = getInitialPosY();

	return (
		<Container
			x={currentPosition.x ?? c * pieceSize}
			y={currentPosition.y ?? r * pieceSize}
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
			zIndex={dragging ? 5000 : 0}
		>

			<Sprite
				texture={new Texture(
					texture.baseTexture,
					new Rectangle(
						c * (texture.width / numCols),
						r * (texture.height / numRows),
						texture.width / numCols,
						texture.height / numRows,
					),
				)}
				x={0}
				y={0}
				width={pieceSize}
				height={pieceSize}
			/>
			<Text
				text={`${c}, ${r}`}
				style={{
					fill: 'white',
					fontSize: 25,
					fontWeight: 'bold',
				} as TextStyle}
				x={0}
				y={0}
				scale={0.1}
			/>
			<Graphics
				width={pieceSize}
				height={pieceSize}
				draw={(g) => {
					g.lineStyle(0.2, 0xffffff);
					g.drawRect(
						0,
						0,
						pieceSize,
						pieceSize,
					);
				}}
			/>
		</Container>
	);
};

export default Piece;
