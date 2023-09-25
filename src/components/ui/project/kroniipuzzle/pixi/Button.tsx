import React from 'react';
import { Container, Graphics, Text } from '@pixi/react';
import { TextStyle } from 'pixi.js';

interface ButtonProps {
	x: number;
	y: number;
	width: number;
	height: number;
	label: string;
	color?: number;
	radius?: number;
	onClick?: () => void;
}

export default function Button({
	x, y, width, height, label, onClick, color = 0x0869EC, radius = 0,
}: ButtonProps) {
	const handleClick = () => {
		if (onClick) {
			onClick();
		}
	};

	return (
		<Container
			eventMode={onClick ? 'static' : 'auto'}
			pointerdown={handleClick}
			x={x}
			y={y}
			cursor={onClick ? 'pointer' : undefined}
		>
			<Graphics
				draw={(g) => {
					g.clear();
					if (color) {
						g.beginFill(color);
						g.drawRoundedRect(0, 0, width, height, radius);
						g.endFill();
					}
				}}
			/>
			<Text
				text={label}
				style={{
					fill: 'white',
					fontSize: 18,
					fontWeight: 'bold',
				} as TextStyle}
				anchor={[0.5, 0.5]}
				x={width / 2}
				y={height / 2}
			/>
		</Container>
	);
}
