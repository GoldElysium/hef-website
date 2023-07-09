import { PixiComponent } from '@pixi/react';
import type { Application } from 'pixi.js';
import * as PIXI from 'pixi.js';
import { Viewport as PixiViewport } from 'pixi-viewport';
import type * as React from 'react';

interface PixiComponentViewportProps extends React.FC {
	width: number;
	height: number;
	disableDragging?: boolean;
	app: Application;
	children?: React.ReactNode;
	x?: number;
	y?: number;
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
			// TODO: Set fixed world width and height
			worldWidth: width,
			worldHeight: height,
			ticker: app.ticker,
			events: app.renderer.events,
		});

		viewport
			.drag()
			.pinch()
			.decelerate()
			.wheel()
			.bounce()
			.clamp({ direction: 'all' })
			.clampZoom({ minScale: 1, maxScale: 4 });

		return viewport;
	},
	applyProps(viewport, _oldProps, _newProps) {
		// eslint-disable-next-line @typescript-eslint/naming-convention
		const { children: oldChildren, disableDragging: _, ...oldProps } = _oldProps;
		const { children: newChildren, disableDragging, ...newProps } = _newProps;

		if (disableDragging) {
			viewport.plugins.pause('drag');
		} else {
			viewport.plugins.resume('drag');
		}

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
