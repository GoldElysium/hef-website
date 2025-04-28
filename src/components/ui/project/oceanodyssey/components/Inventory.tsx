import type { Graphics, TextStyle } from 'pixi.js';
import { useCallback, useState } from 'react';
import Button from '@/components/ui/pixi/Button';

interface InventoryFish {
	name: string;
	length: number;
	weight: number;
	description: string;
	x: number;
	y: number;
	width: number;
	height: number;
	rotated: boolean;
}

interface InventoryProps {
	x: number;
	screenWidth: number;
	screenHeight: number;
}

export default function Inventory({ x, screenWidth, screenHeight }: InventoryProps) {
	// TODO
	/* eslint-disable @typescript-eslint/no-unused-vars */
	const [selectedTab, setSelectedTab] = useState<'bait' | 'fish'>('fish');
	const [moving, setMoving] = useState(false);
	const [detailsVisible, setDetailsVisible] = useState(false);

	const [inventoryContent, setInventoryContent] = useState<InventoryFish[]>([
		{
			name: 'Test',
			length: 30,
			weight: 1,
			description: 'A test fish',
			x: 0,
			y: 0,
			width: 2,
			height: 1,
			rotated: false,
		},
		{
			name: 'Test 2',
			length: 100,
			weight: 10,
			description: 'Another test fish',
			x: 0,
			y: 1,
			width: 4,
			height: 2,
			rotated: true,
		},
	]);

	const drawBackground = useCallback((g: Graphics) => {
		g.clear()
			.rect(0, 0, screenWidth * 0.2, screenHeight)
			.fill({ color: 0x414141, alpha: 0.98 });
	}, [screenWidth, screenHeight]);

	return (
		<pixiContainer
			x={x}
			eventMode="static"
		>
			<pixiGraphics
				draw={drawBackground}
			/>

			<pixiText
				text="Inventory"
				x={48}
				y={24}
				style={{
					fill: 'white',
					fontSize: 32,
				} as TextStyle}
			/>

			<Button
				x={48}
				y={80}
				width={screenWidth * 0.08}
				height={60}
				label="Bait"
				color={0x2E75B5}
				textStyle={{
					fill: 'white',
				}}
				onClick={() => setSelectedTab('bait')}
			/>

			<Button
				x={80 + screenWidth * 0.08}
				y={80}
				width={screenWidth * 0.08}
				height={60}
				label="Fish"
				color={0x2E75B5}
				textStyle={{
					fill: 'white',
				}}
				onClick={() => setSelectedTab('fish')}
			/>

			{
				selectedTab === 'bait' ? (
					<pixiText
						text="Bait"
						x={(screenWidth * 0.2) / 2}
						y={screenHeight / 2}
						style={{
							fill: 'white',
						}}
						anchor={0.5}
					/>
				) : (
					<pixiText
						text="Fish"
						x={(screenWidth * 0.2) / 2}
						y={screenHeight / 2}
						style={{
							fill: 'white',
						}}
						anchor={0.5}
					/>
				)
			}
		</pixiContainer>
	);
}
