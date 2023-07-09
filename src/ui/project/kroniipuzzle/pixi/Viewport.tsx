import { PixiComponent } from '@pixi/react';
import type { Application } from 'pixi.js';
import * as PIXI from 'pixi.js';
import { Viewport as PixiViewport } from 'pixi-viewport';
import type * as React from 'react';

interface PixiComponentViewportProps extends React.FC {
	width: number;
	height: number;
	app: Application;
	children?: React.ReactNode;
}

const Viewport = PixiComponent('Viewport', {
	create({
		width, height, app,
	}: PixiComponentViewportProps) {
		if (!('events' in app.renderer)) {
			// @ts-ignore
			app.renderer.addSystem(PIXI.EventSystem, 'events');
		}

		const viewport = new PixiViewport({
			screenWidth: width,
			screenHeight: height,
			worldWidth: width,
			worldHeight: height,
			ticker: app.ticker,
			events: app.renderer.events,
		});

		viewport
			.drag()
			.pinch()
			.wheel()
			.clamp({ direction: 'all' })
			.clampZoom({ minScale: 0.5, maxScale: 4 });

		return viewport;
	},
	applyProps(viewport, _oldProps, _newProps) {
		const { children: oldChildren, ...oldProps } = _oldProps;
		const { children: newChildren, ...newProps } = _newProps;

		Object.keys(newProps).forEach((p) => {
			// @ts-ignore
			if (oldProps[p] !== newProps[p]) {
				// @ts-ignore
				viewport[p] = newProps[p]; // eslint-disable-line no-param-reassign
			}
		});
	},
	config: {
		destroy: true,
		destroyChildren: true,
	},
});

export default Viewport;
