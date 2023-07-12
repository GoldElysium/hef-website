import React, { useCallback } from 'react';
import { TextStyle, Graphics as PixiGraphics } from 'pixi.js';
import {
	Container, Graphics, Sprite, Text,
} from '@pixi/react';
import PieceInfo from '../puzzle/PieceInfo';

interface PieceDisplayProps {
	x?: number;
	y?: number;
	width: number;
	height: number;
	pieceInfo?: PieceInfo;
	children?: React.ReactNode;
}

export default function PieceDisplay({
	x, y, width, height, pieceInfo, children,
}: PieceDisplayProps) {
	const drawColorForPieceDisplay = useCallback((g: PixiGraphics) => {
		g.clear();
		g.beginFill(0xdd8866);
		g.drawRect(0, 0, width, height);
		g.endFill();
	}, [width, height]);

	const congratulations = pieceInfo?.message?.congratulations;
	const favoriteMoment = pieceInfo?.message?.favoriteMoment
    && `

My Favorite Moment:

${pieceInfo?.message?.favoriteMoment}
`;
	const text: string | undefined = pieceInfo?.message
    && `From: K-${pieceInfo?.message?.from}

  ${congratulations}${favoriteMoment}`;

	return (
		<Container x={x} y={y}>
			<Graphics
				draw={drawColorForPieceDisplay}
			/>
			{text
				&& (
					<Text
						text={text}
						style={{
							align: 'center',
							fill: 'white',
							fontSize: 25,
							wordWrap: true,
							wordWrapWidth: width,
						} as TextStyle}
						x={0}
						y={0}
						scale={1}
					/>
				)}
			{pieceInfo?.sprite
				&& (
					<Sprite
						texture={pieceInfo?.sprite?.texture}
						x={0}
						y={height - pieceInfo.sprite.texture.height / 2}
						width={pieceInfo.sprite.texture.width / 2}
						height={pieceInfo.sprite.texture.height / 2}
						tint={pieceInfo.sprite.tint}
					/>
				)}
			{children}
		</Container>
	);
}
