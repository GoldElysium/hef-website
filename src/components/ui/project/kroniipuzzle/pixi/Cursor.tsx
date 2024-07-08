import React, { useEffect, useState } from 'react';
import * as PIXI from 'pixi.js';
import { FederatedPointerEvent } from 'pixi.js';
import { useApp } from '@pixi/react';
import AnimatedGIF from './AnimatedGIF';

export default function Cursor() {
	const app = useApp();

	const [assetBundle, setAssetBundle] = useState<null | any>(null);
	const [currentCursor, setCurrentCursor] = useState('default');
	const [cursorLocation, setCursorLocation] = useState({ x: 0, y: 0 });

	useEffect(() => {
		PIXI.Assets.loadBundle('puzzle')
			.then((loadedBundle) => {
				setAssetBundle(loadedBundle);
			});
	}, []);

	useEffect(() => {
		app.renderer.events.cursorStyles.default = () => {
			setCurrentCursor('default');
		};
		app.renderer.events.cursorStyles.pointer = () => {
			setCurrentCursor('pointer');
		};

		app.stage.eventMode = 'dynamic';
		app.stage.on('pointermove', (e: FederatedPointerEvent) => {
			setCursorLocation({ x: e.x, y: e.y });
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (!assetBundle) return null;

	return (
		<>
			<AnimatedGIF
				gif={assetBundle['cursor-default']}
				x={cursorLocation.x - 13}
				y={cursorLocation.y - 7}
				width={96}
				height={86}
				visible={currentCursor === 'default'}
			/>
			<AnimatedGIF
				gif={assetBundle['cursor-pointer']}
				x={cursorLocation.x - 17}
				y={cursorLocation.y - 5}
				width={96}
				height={86}
				visible={currentCursor === 'pointer'}
			/>
		</>
	);
}
