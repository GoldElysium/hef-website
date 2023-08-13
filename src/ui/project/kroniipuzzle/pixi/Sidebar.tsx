'use client';

import React, { useCallback, useEffect, useState } from 'react';
import {
	Container, Graphics, Text, Sprite,
} from '@pixi/react';
import { Graphics as PixiGraphics, TextStyle } from 'pixi.js';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context';
import * as PIXI from 'pixi.js';
import Button from './Button';
import { SIDEBAR_WIDTH } from '../puzzle/PuzzleConfig';

interface SidebarProps {
	x?: number;
	y?: number;
	width: number;
	height: number;
	setShowModal: (x: boolean) => void;
	children?: React.ReactNode;
	router: AppRouterInstance
}

export default function Sidebar({
	x, y, width, height, setShowModal, children, router,
}: SidebarProps) {
	const [assetBundle, setAssetBundle] = useState<null | any>(null);

	useEffect(() => {
		PIXI.Assets.loadBundle('puzzle')
			.then((loadedBundle) => {
				setAssetBundle(loadedBundle);
			});
	}, []);

	const drawColorForSidebar = useCallback((g: PixiGraphics) => {
		g.clear();
		g.beginFill(0x001E47);
		g.drawRect(0, 0, width, height);
		g.endFill();
	}, [width, height]);

	return (
		<Container x={x} y={y}>
			<Graphics
				draw={drawColorForSidebar}
			/>
			{children}
			<Container
				eventMode="static"
				onclick={() => router.back()}
				cursor="pointer"
				x={16}
				y={22}
				width={100}
				height={40}
			>
				<Graphics
					draw={(g) => {
						g.clear();
						g.lineStyle(2, 0xffffff);
						g.beginFill(0x001E47);
						g.drawRoundedRect(0, 0, 100, 40, 8);
						g.endFill();
					}}
				/>
				<Container
					anchor={[0.5, 0.5]}
					x={18}
					y={10}
				>
					{
						assetBundle && (
							<Sprite
								width={18}
								height={18}
								texture={assetBundle['back-arrow']}
								x={0}
								y={0}
							/>
						)
					}
					<Text
						x={24}
						y={0}
						text="Back"
						style={{
							fill: 'white',
							fontSize: 16,
							fontWeight: '400',
						} as TextStyle}
					/>
				</Container>
			</Container>
			<Button
				x={SIDEBAR_WIDTH - 166}
				y={16}
				width={150}
				height={50}
				label="Preview"
				onClick={() => { setShowModal(true); }}
				radius={8}
			/>
		</Container>
	);
}
