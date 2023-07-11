import React from 'react';
import {
	Container, Graphics, Text,
} from '@pixi/react';
import { Graphics as PixiGraphics, TextStyle } from 'pixi.js';

interface ModalProps {
	x: number;
	y: number;
	width: number;
	height: number;
	onClick?: () => void;
}

// eslint-disable-next-line react/function-component-definition
const Modal: React.FC<ModalProps> = ({
	x, y, width, height, onClick,
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
					g.beginFill(0x222222);
					g.drawRect(0, 0, width, height);
					g.endFill();
				}}
			/>
			<Text
				text="Happy 2 Year Anniversary, Kronii!"
				style={{
					fill: 'white',
					fontSize: 30,
					fontWeight: 'bold',
				} as TextStyle}
				anchor={[0.5, 0.5]}
				x={width / 2}
				y={height / 2}
			/>
		</Container>
	);
};

export default Modal;
