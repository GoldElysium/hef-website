import React from 'react';
import { Container, Graphics, Text } from '@pixi/react';
import { Graphics as PixiGraphics, TextStyle } from 'pixi.js';

interface ButtonProps {
	x: number;
	y: number;
	width: number;
	height: number;
	label: string;
	onClick?: () => void;
}

// eslint-disable-next-line react/function-component-definition
const Button: React.FC<ButtonProps> = ({
	x, y, width, height, label, onClick,
}) => {
	const handleClick = () => {
		if (onClick) {
			onClick();
		}
	};

	return (
		<Container interactive pointerdown={handleClick} x={x} y={y}>
			<Graphics
				draw={(g: PixiGraphics) => {
					g.clear();
					g.beginFill(0x22bb55);
					g.drawRect(0, 0, width, height);
					g.endFill();
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
};

export default Button;
