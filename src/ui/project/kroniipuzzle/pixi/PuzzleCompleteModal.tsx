import React, { useEffect, useMemo, useState } from 'react';
import {
	Container, Graphics, Sprite, Text,
} from '@pixi/react';
import * as PIXI from 'pixi.js';
import { Graphics as PixiGraphics, TextStyle } from 'pixi.js';
import AnimatedGIF from './AnimatedGIF';
import Button from './Button';

interface ModalProps {
	x: number;
	y: number;
	width: number;
	height: number;
	closeModal: () => void;
	openSettings: () => void;
}

export default function PuzzleCompleteModal({
	x, y, width, height, closeModal, openSettings,
}: ModalProps) {
	const [assetBundle, setAssetBundle] = useState<null | any>(null);

	useEffect(() => {
		PIXI.Assets.loadBundle('puzzle')
			.then((loadedBundle) => {
				setAssetBundle(loadedBundle);
			});
	}, []);

	const {
		gifWidth, gifHeight, gifX, gifY,
	} = useMemo(() => {
		const calcWidth = window.innerWidth > window.innerHeight
			? (window.innerHeight / 1125) * 1922
			: window.innerWidth;

		const calcHeight = window.innerWidth > window.innerHeight
			? window.innerHeight
			: (window.innerWidth / 1922) * 1125;

		return {
			gifWidth: calcWidth,
			gifHeight: calcHeight,
			gifX: (window.innerWidth - calcWidth) / 2,
			gifY: (window.innerHeight - calcHeight) / 2,
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [window.innerWidth, window.innerHeight]);

	return (
		<Container x={x} y={y}>
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
					fontSize: 40,
					fontWeight: 'bold',
				} as TextStyle}
				anchor={[0.5, 0.5]}
				x={width / 2}
				y={height / 2}
			/>
			<Button
				x={width / 2 - 110}
				y={height / 2 + 40}
				width={220}
				height={60}
				radius={16}
				label="Credits / reset puzzle"
				onClick={openSettings}
			/>
			{assetBundle && (
				<AnimatedGIF
					x={-x + gifX}
					y={-y + gifY}
					gif={assetBundle.congrats_kronii}
					width={gifWidth}
					height={gifHeight}
				/>
			)}

			<Container
				x={width - 64}
				y={32}
				eventMode="static"
				onclick={closeModal}
				cursor="pointer"
			>
				<Graphics
					draw={(g) => {
						g.clear();
						g.beginFill(0xBDD1EC);
						g.drawCircle(16, 16, 20);
						g.endFill();
					}}
				/>
				<Sprite
					image="/assets/kroniipuzzle/x-mark.svg"
					tint={0x000000}
					width={32}
					height={32}
				/>
			</Container>
		</Container>
	);
}
