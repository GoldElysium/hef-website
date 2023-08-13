import React from 'react';
import {
	Container, Graphics, Sprite, Text,
} from '@pixi/react';
import { Graphics as PixiGraphics, TextStyle } from 'pixi.js';

interface ModalProps {
	x: number;
	y: number;
	width: number;
	height: number;
	label?: string;
	onClick?: () => void;
}

export default function Modal({
	x, y, width, height, label, onClick,
}: ModalProps) {
	const handleClick = () => {
		if (onClick) {
			onClick();
		}
	};

	return (
		<Container eventMode={onClick ? 'static' : 'auto'} pointerdown={handleClick} x={x} y={y}>
			<Graphics
				draw={(g: PixiGraphics) => {
					g.clear();
					g.beginFill(0x222222);
					g.drawRect(0, 0, width, height);
					g.endFill();
				}}
			/>
			<Sprite
				image="/assets/kroniipuzzle/puzzle.png"
				x={width / 2}
				y={height / 2}
				width={Math.min(width, height * 2)}
				height={Math.min(width / 2, height)}
				anchor={{ x: 0.5, y: 0.5 }}
			/>
			<Text
				text={label}
				style={{
					fill: 'white',
					fontSize: 20,
					strokeThickness: 4,
					letterSpacing: 0.5,
					fontWeight: 'bold',
					lineJoin: 'round',
					dropShadow: false,
					dropShadowAlpha: 0.25,
					dropShadowBlur: 4,
				} as TextStyle}
				anchor={[0.5, 0.5]}
				x={width / 2}
				y={64}
			/>
		</Container>
	);
}
