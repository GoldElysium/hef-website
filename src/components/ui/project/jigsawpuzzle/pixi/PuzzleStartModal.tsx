import {
	Container, Graphics, Sprite, Text,
} from '@pixi/react';
import { Graphics as PixiGraphics, TextStyle } from 'pixi.js';
import React, { useCallback, useContext } from 'react';
import ThemeContext from '@/components/ui/project/jigsawpuzzle/providers/ThemeContext';
import Button from './Button';

interface ModalProps {
	width: number;
	height: number;
	text: string;
	closeModal: () => void;
}

export default function PuzzleStartModal({
	width, height, text, closeModal,
}: ModalProps) {
	const { colors: themeColors, resolvedTheme } = useContext(ThemeContext);

	const drawExitButton = useCallback((g: PixiGraphics) => {
		g.clear();
		g.beginFill(themeColors[resolvedTheme].secondary);
		g.drawCircle(16, 16, 20);
		g.endFill();
	}, [resolvedTheme, themeColors]);

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
				text={text}
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
				y={height / 2 + 240}
				width={220}
				height={60}
				radius={16}
				color={themeColors[resolvedTheme].primary}
				textColor={themeColors[resolvedTheme].primaryForeground}
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
					draw={drawExitButton}
				/>
				<Sprite
					image="https://cdn.holoen.fans/hefw/assets/jigsawpuzzle/x-mark.svg"
					tint={themeColors[resolvedTheme].secondaryForeground}
					width={32}
					height={32}
				/>
			</Container>
		</Container>
	);
}
