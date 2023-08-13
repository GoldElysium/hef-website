import React, { useCallback } from 'react';
import { TextStyle, Graphics as PixiGraphics } from 'pixi.js';
import {
	Container, Graphics, Sprite, Text,
} from '@pixi/react';
import PieceInfo from '../puzzle/PieceInfo';
import TaggedText from './TaggedText';

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
		g.beginFill(0xBDD1EC);
		g.drawRoundedRect(0, 0, width, height, 8);
		g.endFill();
	}, [width, height]);

	const congratulations = pieceInfo?.message?.congratulations;
	const favoriteMoment = pieceInfo?.message?.favoriteMoment
    && `

<b>My Favorite Moment:</b>
${pieceInfo?.message?.favoriteMoment}
`;
	const text: string | undefined = pieceInfo?.message
    && `<h><b>From: ${pieceInfo?.message?.from}</b></h>
${congratulations}${favoriteMoment}`;

	return (
		<Container x={x} y={y}>
			<Graphics
				draw={drawColorForPieceDisplay}
			/>
			{!pieceInfo && (
				<Text
					text="No puzzle piece has been selected"
					style={{
						align: 'center',
						fontSize: 25,
						fontWeight: 'bold',
						wordWrap: true,
						wordWrapWidth: width - 32,
					} as TextStyle}
					y={height / 2}
					x={width / 2}
					width={width - 32}
					anchor={{
						x: 0.5,
						y: 0.5,
					}}
					scale={1}
				/>
			)}
			{text
				&& (
					<TaggedText
						text={text}
						styles={{
							default: {
								fill: 'black',
								fontSize: 20,
								wordWrap: true,
								wordWrapWidth: width - 16,
							},
							b: {
								fontWeight: 'bold',
							},
							i: {
								fontStyle: 'italic',
							},
							h: {
								fontSize: 24,
							},
						}}
						options={{
							debugConsole: true,
						}}
						x={12}
						y={16}
						width={width - 16}
						height={height - 16}
						scale={{ x: 1, y: 1 }}
					/>
				)}
			{pieceInfo?.sprite
				&& (
					<Sprite
						texture={pieceInfo?.sprite?.texture}
						x={32}
						y={height - pieceInfo.sprite.texture.height / 2 - 32}
						width={pieceInfo.sprite.texture.width / 2}
						height={pieceInfo.sprite.texture.height / 2}
						tint={pieceInfo.sprite.tint}
					/>
				)}
			{children}
		</Container>
	);
}
