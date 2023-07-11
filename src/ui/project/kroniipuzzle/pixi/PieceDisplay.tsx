import { PixiComponent } from '@pixi/react';
import type { Application } from 'pixi.js';
import * as PIXI from 'pixi.js';
import { Viewport as PixiViewport } from 'pixi-viewport';
import type * as React from 'react';

interface PixiComponentPieceDisplayProps extends React.FC {
	width: number;
	height: number;
	app: Application;
	children?: React.ReactNode;
}

const PieceDisplay = PixiComponent('PieceDisplay', {
	create({ width, height, app }: PixiComponentPieceDisplayProps) {
		if (!('events' in app.renderer)) {
			// @ts-ignore
			props.app.renderer.addSystem(PIXI.EventSystem, 'events');
		}

		const container = new PixiViewport({
			screenWidth: width,
			screenHeight: height,
			worldWidth: width,
			worldHeight: height,
			ticker: app.ticker,
			events: app.renderer.events,
		});

		return container;
	},
	applyProps(pieceDisplay, _oldProps, _newProps) {
		const { children: oldChildren, ...oldProps } = _oldProps;
		const { children: newChildren, ...newProps } = _newProps;

		Object.keys(newProps).forEach((p) => {
			// @ts-ignore
			if (oldProps[p] !== newProps[p]) {
				// @ts-ignore
				pieceDisplay[p] = newProps[p]; // eslint-disable-line no-param-reassign
			}
		});
	},
	config: {
		destroy: true,
		destroyChildren: true,
	},
});

export default PieceDisplay;
