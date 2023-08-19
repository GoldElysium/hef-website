import React, {
	useCallback, useEffect, useRef, useState,
} from 'react';
import { Graphics as PixiGraphics, TextStyle } from 'pixi.js';
import {
	Container, Graphics, Sprite, Text, useApp,
} from '@pixi/react';
import PixiTaggedText from 'pixi-tagged-text';
import PieceInfo from '../puzzle/PieceInfo';
import TaggedText from './TaggedText';
import Scrollbox from './Scrollbox';
import PixiScrollbox from './PixiScrollbox';

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
	const congratulations = pieceInfo?.message?.congratulations ?? '';
	const favoriteMoment = pieceInfo?.message?.favoriteMoment
		? `

<b>My Favorite Moment:</b>
${pieceInfo.message.favoriteMoment}
` : '';
	const text: string | undefined = pieceInfo?.message
		&& `<h><b>From: ${pieceInfo.message.from}</b></h>
${congratulations}${favoriteMoment}`;

	const app = useApp();

	const scrollboxRef = useRef<PixiScrollbox>(null);
	const taggedTextRef = useRef<PixiTaggedText>(null);

	const [spriteY, setSpriteY] = useState(height);

	useEffect(() => {
		scrollboxRef.current?.update();

		if (taggedTextRef.current) {
			taggedTextRef.current.update();
			taggedTextRef.current.draw();

			setSpriteY(taggedTextRef.current.getLocalBounds().height);
			scrollboxRef.current?.update();
		}
	}, [pieceInfo]);

	const drawColorForPieceDisplay = useCallback((g: PixiGraphics) => {
		g.clear();
		g.beginFill(0xBDD1EC);
		g.drawRoundedRect(0, 0, width, height, 8);
		g.endFill();
	}, [width, height]);

	return (
		<Container
			x={x}
			y={y}
		>
			<Graphics
				draw={drawColorForPieceDisplay}
				x={0}
				y={0}
			/>
			<Scrollbox
				boxWidth={width}
				boxHeight={height - 16}
				app={app}
				ref={scrollboxRef}
				x={0}
				y={8}
			>
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
								wordWrapWidth: width - 32,
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
						x={16}
						y={16}
						width={width - 32}
						height={height - 16}
						scale={{ x: 1, y: 1 }}
						ref={taggedTextRef}
					/>
				)}
				{pieceInfo?.sprite
				&& (
					<>
						<Sprite
							texture={pieceInfo?.sprite?.texture}
							x={16}
							y={Math.max(height - pieceInfo.sprite.texture.height / 2 - 32, spriteY + 75)}
							width={pieceInfo.sprite.texture.width}
							height={pieceInfo.sprite.texture.height}
							scale={[0.5, 0.5]}
							tint={pieceInfo.sprite.tint}
						/>
						<Graphics
							x={16}
							y={Math.max(height - pieceInfo.sprite.texture.height / 2 - 32, spriteY + 75)}
							draw={(g) => {
								g.clear();
								g.beginFill(0, 1);
								g.drawRect(0, 0, 0, (pieceInfo.sprite.texture.height / 2) * 1.08);
							}}
						/>
					</>
				)}
				{children}
			</Scrollbox>
		</Container>
	);
}
