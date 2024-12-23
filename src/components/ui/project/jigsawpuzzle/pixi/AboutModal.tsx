'use client';

import React, {
	Dispatch, SetStateAction, useCallback, useContext, useState,
} from 'react';
import {
	Container, Graphics, Sprite, Text, useApp,
} from '@pixi/react';
import { Graphics as PixiGraphics, TextStyle } from 'pixi.js';
import ThemeContext from '@/components/ui/project/jigsawpuzzle/providers/ThemeContext';
import usePuzzleStore from '../providers/PuzzleStoreConsumer';
import TaggedText from './TaggedText';
import Button from './Button';
import Scrollbox from './Scrollbox';
import PuzzleStoreContext from '../providers/PuzzleStoreContext';
import CreditsRenderer, { CreditNode } from './CreditsRenderer';

export interface Credits {
	length: number;
	nodes: CreditNode[];
}

interface AboutModalProps {
	x: number;
	y: number;
	width: number;
	height: number;
	aboutText: string;
	credits: Credits;
	setResetTrigger: Dispatch<SetStateAction<boolean>>;
	setShowSettingsModal: Dispatch<SetStateAction<boolean>>;
	setShowAllSubmissions: Dispatch<SetStateAction<boolean>>;
}

export default function AboutModal({
	x,
	y,
	width,
	height,
	aboutText,
	credits,
	setResetTrigger,
	setShowSettingsModal,
	setShowAllSubmissions,
}: AboutModalProps) {
	const app = useApp();
	const [message, setMessage] = useState<string | null>(null);

	const puzzleStore = useContext(PuzzleStoreContext)!;
	const difficultyName = usePuzzleStore((state) => state.difficultyName);
	const setDifficulty = usePuzzleStore((state) => state.setDifficulty);

	const { colors: themeColors, resolvedTheme } = useContext(ThemeContext);

	const drawBackground = useCallback((g: PixiGraphics) => {
		g.clear();
		g.beginFill(themeColors[resolvedTheme].background);
		g.drawRect(0, 0, width, height);
		g.endFill();
	}, [themeColors, resolvedTheme, width, height]);

	const drawSettingsBox = useCallback((g: PixiGraphics) => {
		g.clear();
		g.beginFill(themeColors[resolvedTheme].secondary);
		g.drawRoundedRect(0, 0, 700, 400, 8);
		g.endFill();
	}, [resolvedTheme, themeColors]);

	const drawCreditsBox = useCallback((g: PixiGraphics) => {
		g.clear();
		g.beginFill(themeColors[resolvedTheme].secondary);
		g.drawRoundedRect(0, 0, 700, 864, 8);
		g.endFill();
	}, [resolvedTheme, themeColors]);

	const drawExitButton = useCallback((g: PixiGraphics) => {
		g.clear();
		g.beginFill(themeColors[resolvedTheme].secondary);
		g.drawCircle(16, 16, 20);
		g.endFill();
	}, [resolvedTheme, themeColors]);

	return (
		<Container
			x={x}
			y={y}
		>
			<Graphics
				draw={drawBackground}
			/>
			<Container x={width / 2} y={height / 2} anchor={[0.5, 0.5]}>
				<Container
					x={-732}
					y={-432}
				>
					<Graphics
						draw={drawSettingsBox}
					/>
					<Scrollbox
						boxWidth={700}
						boxHeight={400}
						app={app}
						overflowY="scroll"
					>
						<Text
							text="About"
							style={{
								fill: themeColors[resolvedTheme].secondaryForeground,
								fontWeight: 'bold',
								fontSize: 24,
							} as TextStyle}
							x={350}
							y={32}
							anchor={[0.5, 0]}
						/>
						<TaggedText
							text={aboutText}
							styles={{
								default: {
									fill: themeColors[resolvedTheme].secondaryForeground,
									fontSize: 18,
									wordWrap: true,
									wordWrapWidth: 636,
								},
								b: {
									fontWeight: 'bold',
								},
								i: {
									fontStyle: 'italic',
								},
								h: {
									fontSize: 24,
								},
							}}
							x={32}
							y={64}
							width={636}
							scale={{ x: 1, y: 1 }}
						/>
						<Graphics
							y={600}
							draw={(g) => {
								g.beginFill(0);
								g.drawRect(0, 0, 0, 0);
								g.endFill();
							}}
						/>
					</Scrollbox>
				</Container>
				<Container
					x={-732}
					y={32}
				>
					<Graphics
						draw={drawSettingsBox}
					/>
					<Text
						text="Settings"
						style={{
							fill: themeColors[resolvedTheme].secondaryForeground,
							fontWeight: 'bold',
							fontSize: 24,
						} as TextStyle}
						x={350}
						y={32}
						anchor={[0.5, 0]}
					/>
					<Button
						x={180}
						y={96}
						width={150}
						height={60}
						radius={12}
						color={0xAA2222}
						label="Reset puzzle"
						onClick={() => {
							const puzzleState = puzzleStore.getState();
							puzzleState.reset();
							setMessage('Puzzle has been reset!');
							setResetTrigger((prevVal) => !prevVal);
						}}
					/>
					<Button
						x={370}
						y={96}
						width={150}
						height={60}
						radius={12}
						color={0xAA2222}
						label="Full reset"
						onClick={() => {
							const puzzleState = puzzleStore.getState();
							puzzleState.reset();
							puzzleState.setFirstLoad(true);
							if (puzzleState.difficultyName !== 'default') puzzleState.setDifficulty(null);
							setMessage('Puzzle has been reset!');
							window.location.reload();
						}}
					/>
					{difficultyName !== 'default' && (
						<Button
							x={250}
							y={182}
							width={200}
							height={60}
							radius={12}
							color={0xAA2222}
							label="Change difficulty"
							onClick={() => {
								setDifficulty(null);
								setShowSettingsModal(false);
							}}
						/>
					)}
					<Button
						x={225}
						y={280}
						width={250}
						height={60}
						radius={12}
						color={themeColors[resolvedTheme].primary}
						textColor={themeColors[resolvedTheme].primaryForeground}
						label="See all submissions"
						onClick={() => setShowAllSubmissions(true)}
					/>
					{message && (
						<Text
							text={message}
							style={{
								fill: themeColors[resolvedTheme].secondaryForeground,
								fontSize: 20,
							} as TextStyle}
							x={350}
							y={352}
							anchor={[0.5, 0]}
						/>
					)}
				</Container>
				<Container
					x={32}
					y={-432}
				>
					<Graphics
						draw={drawCreditsBox}
						x={0}
						y={0}
					/>
					<Scrollbox
						boxWidth={700}
						boxHeight={864}
						app={app}
						overflowY="scroll"
					>
						<Text
							text="Credits"
							style={{
								fill: themeColors[resolvedTheme].secondaryForeground,
								fontWeight: 'bold',
								fontSize: 40,
							} as TextStyle}
							x={350}
							y={32}
							anchor={[0.5, 0]}
							scale={[1, 1]}
						/>
						<CreditsRenderer
							nodes={credits.nodes}
							textColor={themeColors[resolvedTheme].secondaryForeground}
							linkColor={themeColors[resolvedTheme].link}
						/>

						<Graphics
							y={credits.length}
							draw={(g) => {
								g.beginFill(0);
								g.drawRect(0, 0, 0, 0);
								g.endFill();
							}}
						/>
					</Scrollbox>
				</Container>
			</Container>
			<Container
				x={width - 64}
				y={32}
				eventMode="static"
				onclick={() => setShowSettingsModal(false)}
				cursor="pointer"
			>
				<Graphics
					draw={drawExitButton}
				/>
				<Sprite
					image="https://cdn.holoen.fans/hefw/assets/jigsawpuzzle/x-mark.svg"
					tint={themeColors[resolvedTheme].secondaryForeground}
					width={32}
					height={32}
				/>
			</Container>
		</Container>
	);
}
