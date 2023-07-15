import { PixiComponent } from '@pixi/react';
import type { Application } from 'pixi.js';
import * as PIXI from 'pixi.js';
import { Viewport as PixiViewport } from 'pixi-viewport';
import type * as React from 'react';
import { MutableRefObject } from 'react';

interface PixiComponentViewportProps {
	width?: number;
	height?: number;
	worldWidth?: number;
	worldHeight?: number;
	disableDragging?: boolean;
	app: Application;
	children?: React.ReactNode;
	x?: number;
	y?: number;
	ref?: MutableRefObject<PixiViewport | null>
}

const Viewport = PixiComponent('Viewport', {
	create({
		width, height, worldWidth, worldHeight, app, ref,
	}: PixiComponentViewportProps) {
		if (!('events' in app.renderer)) {
			// @ts-ignore
			app.renderer.addSystem(PIXI.EventSystem, 'events');
		}

		const viewport = new PixiViewport({
			screenWidth: width,
			screenHeight: height,
			worldWidth: worldWidth ?? width,
			worldHeight: worldHeight ?? height,
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
			.clampZoom({ minScale: 0.2, maxScale: 10 });

		if (ref) {
			// eslint-disable-next-line no-param-reassign
			ref.current = viewport;
		}

		return viewport;
	},
	applyProps(viewport, _oldProps, _newProps) {
		/* eslint-disable @typescript-eslint/naming-convention */
		const {
			children: oldChildren,
			disableDragging: _disableDragging,
			width: oldWidth,
			height: oldHeight,
			worldWidth: oldWorldWidth,
			worldHeight: oldWorldHeight,
			ref: _oldRef,
			...oldProps
		} = _oldProps;
		/* eslint-enable */
		const {
			children: newChildren,
			disableDragging,
			width,
			height,
			worldWidth,
			worldHeight,
			ref,
			...newProps
		} = _newProps;

		if (
			oldWidth !== width
			|| oldHeight !== height
			|| oldWorldWidth !== worldWidth
			|| oldWorldHeight !== worldHeight
		) {
			viewport.resize(
				width,
				height,
				worldWidth ?? width,
				worldHeight ?? worldHeight,
			);
		}

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

		if (ref) {
			ref.current = viewport;
		}
	},
	config: {
		destroy: true,
		destroyChildren: true,
	},
});

export default Viewport;
