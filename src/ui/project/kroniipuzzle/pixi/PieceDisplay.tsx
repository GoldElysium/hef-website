import React, { useCallback } from 'react';
import { Container, Graphics } from '@pixi/react';
import { Graphics as PixiGraphics } from 'pixi.js';

interface PieceDisplayProps {
	x: number;
	y: number;
	width: number;
	height: number;
	children?: React.ReactNode;
}

// eslint-disable-next-line react/function-component-definition
const PieceDisplay: React.FC<PieceDisplayProps> = ({
	x, y, width, height, children,
}) => {
	const drawColorForPieceDisplay = useCallback((g: PixiGraphics) => {
		g.clear();
		g.beginFill(0xff9955);
		g.drawRect(0, 0, width, height);
		g.endFill();
	}, [width, height]);

	return (
		<Container x={x} y={y}>
			<Graphics
				draw={drawColorForPieceDisplay}
			/>
			{children}
		</Container>
	);
};

export default PieceDisplay;
