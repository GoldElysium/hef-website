import React, { useCallback } from 'react';
import { Container, Graphics } from '@pixi/react';
import { Graphics as PixiGraphics } from 'pixi.js';

interface SidebarProps {
	x: number;
	y: number;
	width: number;
	height: number;
	onClick?: () => void;
	children?: React.ReactNode;
}

// eslint-disable-next-line react/function-component-definition
const Sidebar: React.FC<SidebarProps> = ({
	x, y, width, height, onClick, children,
}) => {
	const handleClick = () => {
		if (onClick) {
			onClick();
		}
	};

	const drawColorForSidebar = useCallback((g: PixiGraphics) => {
		g.clear();
		g.beginFill(0xff9955);
		g.drawRect(0, 0, width, height);
		g.endFill();
	}, [width, height]);

	return (
		<Container interactive pointerdown={handleClick} x={x} y={y}>
			<Graphics
				draw={drawColorForSidebar}
			/>
			{children}
		</Container>
	);
};

export default Sidebar;
