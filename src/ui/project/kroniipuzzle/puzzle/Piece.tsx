/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {
	useState,
} from 'react';
import {
	Container, Graphics, Sprite, Text,
} from '@pixi/react';
import { Rectangle, TextStyle, Texture } from 'pixi.js';

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
	const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
	const [currentPosition, setCurrentPosition] = useState({ x: 0, y: 0 });

	const handleDragStart = (event: React.PointerEvent<HTMLElement>) => {
		setDragging(true);
		setStartPosition({ x: event.clientX, y: event.clientY });
	};

	const handleDragMove = (event: React.PointerEvent<HTMLElement>) => {
		if (dragging) {
			setCurrentPosition({ x: event.clientX, y: event.clientY });
		}
	};

	const handleDragEnd = () => {
		setDragging(false);
		setStartPosition({ x: 0, y: 0 });
		setCurrentPosition({ x: 0, y: 0 });
	};

	const piecePositionX = dragging ? currentPosition.x - startPosition.x : c * pieceSize;
	const piecePositionY = dragging ? currentPosition.y - startPosition.y : r * pieceSize;

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
			x={piecePositionX}
			y={piecePositionY}
			interactive
			onpointerdown={(event: any) => handleDragStart(event)}
			onpointermove={(event: any) => handleDragMove(event)}
			onpointerup={handleDragEnd}
			onpointerupoutside={handleDragEnd}
			touchstart={handleDragEnd}
			touchmove={handleDragEnd}
			touchend={handleDragEnd}
			touchendoutside={handleDragEnd}
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
