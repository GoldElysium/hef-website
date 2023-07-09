/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
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
		<Container>
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
				x={c * pieceSize}
				y={r * pieceSize}
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
				x={c * pieceSize}
				y={r * pieceSize}
				scale={0.1}
			/>
			{/* todo: figure out why this scales weirdly */}
			{/* <Graphics
				width={pieceSize}
				height={pieceSize}
				draw={(g) => {
					g.lineStyle(1, 0xffffff);
					g.drawRect(
						c * pieceSize,
						r * pieceSize,
						pieceSize,
						pieceSize,
					);
				}}
			/> */}
		</Container>
	);
};

export default Piece;
