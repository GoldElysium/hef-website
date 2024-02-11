import {
	Container, Graphics, Sprite, Text,
} from '@pixi/react';
import { Graphics as PixiGraphics, TextStyle } from 'pixi.js';
import React from 'react';
import { ABOUT_TEXT } from '../puzzle/PuzzleConfig';
import Button from './Button';

interface ModalProps {
	width: number;
	height: number;
	closeModal: () => void;
}

export default function PuzzleStartModal({
	width, height, closeModal,
}: ModalProps) {
	return (
		<Container>
			<Graphics
				draw={(g: PixiGraphics) => {
					g.clear();
					g.beginFill(0x222222);
					g.drawRect(0, 0, width, height);
					g.endFill();
				}}
			/>
			<Text
				text={ABOUT_TEXT}
				style={{
					fill: 'white',
					fontSize: 20,
					wordWrap: true,
					wordWrapWidth: Math.min(width * 0.6, 1000),
				} as TextStyle}
				anchor={[0.5, 0.5]}
				width={Math.min(width * 0.6, 1000)}
				x={width / 2}
				y={height / 2 - 60}
				scale={[1, 1]}
			/>
			<Button
				x={width / 2 - 110}
				y={height / 2 + 100}
				width={220}
				height={60}
				radius={16}
				label="Begin"
				onClick={closeModal}
			/>

			<Container
				x={width - 64}
				y={32}
				eventMode="static"
				onclick={closeModal}
				cursor="pointer"
			>
				<Graphics
					draw={(g) => {
						g.clear();
						g.beginFill(0xBDD1EC);
						g.drawCircle(16, 16, 20);
						g.endFill();
					}}
				/>
				<Sprite
					image="https://cdn.holoen.fans/hefw/assets/kroniipuzzle/x-mark.svg"
					tint={0x000000}
					width={32}
					height={32}
				/>
			</Container>
		</Container>
	);
}
