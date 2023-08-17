import React, { useEffect, useMemo, useState } from 'react';
import {
	Container, Graphics, Text,
} from '@pixi/react';
import * as PIXI from 'pixi.js';
import { Graphics as PixiGraphics, TextStyle } from 'pixi.js';
import AnimatedGIF from './AnimatedGIF';

interface ModalProps {
	x: number;
	y: number;
	width: number;
	height: number;
	onClick?: () => void;
}

export default function Modal({
	x, y, width, height, onClick,
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
	}, [window.innerWidth, window.innerHeight]);

	const handleClick = () => {
		if (onClick) {
			onClick();
		}
	};

	return (
		<Container eventMode={onClick ? 'static' : 'auto'} pointerdown={handleClick} x={x} y={y}>
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
			{assetBundle && (
				<AnimatedGIF
					x={-x + gifX}
					y={-y + gifY}
					gif={assetBundle.congrats_kronii}
					width={gifWidth}
					height={gifHeight}
				/>
			)}
		</Container>
	);
}
