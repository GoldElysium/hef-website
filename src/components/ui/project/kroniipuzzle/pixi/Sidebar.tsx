'use client';

import React, {
	useCallback, useContext, useEffect, useState,
} from 'react';
import {
	Container, Graphics, Sprite, Text,
} from '@pixi/react';
import * as PIXI from 'pixi.js';
import { Graphics as PixiGraphics, TextStyle } from 'pixi.js';
import Button from './Button';
import { SIDEBAR_WIDTH } from '../puzzle/PuzzleConfig';
import ThemeContext from '../providers/ThemeContext';

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

	const { colors: themeColors, resolvedTheme } = useContext(ThemeContext);

	useEffect(() => {
		PIXI.Assets.loadBundle('puzzle')
			.then((loadedBundle) => {
				setAssetBundle(loadedBundle);
			});
	}, []);

	const drawColorForSidebar = useCallback((g: PixiGraphics) => {
		g.clear();
		g.beginFill(themeColors[resolvedTheme].background);
		g.drawRect(0, 0, width, height);
		g.endFill();
	}, [themeColors, resolvedTheme, width, height]);

	const drawExitButton = useCallback((g: PixiGraphics) => {
		g.clear();
		g.lineStyle(2, themeColors[resolvedTheme].text);
		g.beginFill(themeColors[resolvedTheme].background);
		g.drawRoundedRect(0, 0, 100, 40, 8);
		g.endFill();
	}, [resolvedTheme, themeColors]);

	return (
		<Container x={x ?? 0} y={y ?? 0}>
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
					draw={drawExitButton}
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
								tint={themeColors[resolvedTheme].secondaryForeground}
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
							fill: themeColors[resolvedTheme].text,
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
				color={themeColors[resolvedTheme].primary}
				textColor={themeColors[resolvedTheme].primaryForeground}
				radius={8}
			/>

			<Button
				x={SIDEBAR_WIDTH - 166}
				y={82}
				width={150}
				height={50}
				label="About"
				onClick={() => { setShowSettingsModal(true); }}
				color={themeColors[resolvedTheme].secondary}
				textColor={themeColors[resolvedTheme].secondaryForeground}
				radius={8}
			/>
		</Container>
	);
}
