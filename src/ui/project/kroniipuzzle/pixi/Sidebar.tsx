import React, { useCallback } from 'react';
import { Container, Graphics } from '@pixi/react';
import { Graphics as PixiGraphics } from 'pixi.js';
import Button from './Button';

interface SidebarProps {
	x?: number;
	y?: number;
	width: number;
	height: number;
	setShowModal: (x: boolean) => void;
	children?: React.ReactNode;
}

export default function Sidebar({
	x, y, width, height, setShowModal, children,
}: SidebarProps) {
	const drawColorForSidebar = useCallback((g: PixiGraphics) => {
		g.clear();
		g.beginFill(0xff9955);
		g.drawRect(0, 0, width, height);
		g.endFill();
	}, [width, height]);

	return (
		<Container x={x} y={y}>
			<Graphics
				draw={drawColorForSidebar}
			/>
			{children}
			<Button
				x={0}
				y={0}
				width={200}
				height={100}
				label="Preview"
				onClick={() => { setShowModal(true); }}
			/>
		</Container>
	);
}
