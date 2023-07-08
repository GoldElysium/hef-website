import { PixiComponent } from '@pixi/react';
import type { Application } from 'pixi.js';
import * as PIXI from 'pixi.js';
import { Viewport as PixiViewport } from 'pixi-viewport';
import type * as React from 'react';

interface PixiComponentSidebarProps extends React.FC {
	width: number;
	height: number;
	app: Application;
	children?: React.ReactNode;
}

const Sidebar = PixiComponent('Sidebar', {
	create({ width, height, app }: PixiComponentSidebarProps) {
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
		const sidebar = new PixiViewport({
			screenWidth: width,
			screenHeight: height,
			worldWidth: width,
			worldHeight: height,
			ticker: app.ticker,
			events: app.renderer.events,
		});
		sidebar
			.drag()
			.pinch()
			.wheel()
			.clamp({ direction: 'all' })
			.clampZoom({ minScale: 0.5, maxScale: 4 });
		container.addChild(sidebar);

		return container;
	},
	applyProps(sidebar, _oldProps, _newProps) {
		const { children: oldChildren, ...oldProps } = _oldProps;
		const { children: newChildren, ...newProps } = _newProps;

		Object.keys(newProps).forEach((p) => {
			// @ts-ignore
			if (oldProps[p] !== newProps[p]) {
				// @ts-ignore
				sidebar[p] = newProps[p]; // eslint-disable-line no-param-reassign
			}
		});
	},
	config: {
		destroy: true,
		destroyChildren: true,
	},
});

export default Sidebar;
