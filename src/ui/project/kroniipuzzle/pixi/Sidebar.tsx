'use client';

import React, { useCallback, useEffect, useState } from 'react';
import {
	Container, Graphics, Sprite, Text,
} from '@pixi/react';
import * as PIXI from 'pixi.js';
import { Graphics as PixiGraphics, TextStyle } from 'pixi.js';
import Button from './Button';
import { SIDEBAR_WIDTH } from '../puzzle/PuzzleConfig';

interface SidebarProps {
	x?: number;
	y?: number;
	width: number;
	height: number;
	setShowPreview: (val: boolean) => void;
	setShowExitModal: (val: boolean) => void;
	setShowSettingsModal: (val: boolean) => void;
	children?: React.ReactNode;
}

export default function Sidebar({
	x, y, width, height, setShowPreview, setShowExitModal, setShowSettingsModal, children,
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
				onclick={() => setShowExitModal(true)}
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
					x={22}
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
						text="Exit"
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
				onClick={() => { setShowPreview(true); }}
				radius={8}
			/>

			<Button
				x={SIDEBAR_WIDTH - 166}
				y={82}
				width={150}
				height={50}
				label="About"
				onClick={() => { setShowSettingsModal(true); }}
				color={0x1c5393}
				radius={8}
			/>
		</Container>
	);
}
