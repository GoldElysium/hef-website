import { PixiComponent } from '@pixi/react';
import * as React from 'react';
import * as PIXI from 'pixi.js';
import PixiScrollbox from './PixiScrollbox';

interface PixiComponentScrollboxProps {
	boxWidth: number;
	boxHeight: number;
	app: PIXI.Application;
	x?: number;
	y?: number;
	children?: React.ReactNode;
	ref?: React.MutableRefObject<PixiScrollbox | null>;
}

const Scrollbox = PixiComponent('Scrollbox', {
	create({
		boxWidth, boxHeight, x, y, app, ref,
	}: PixiComponentScrollboxProps) {
		const scrollbox = new PixiScrollbox({
			boxWidth,
			boxHeight,
			app,
			overflowX: 'none',
			overflowY: 'auto',
			passiveWheel: true,
			scrollbarForeground: 0x000000,
			// scrollbarBackgroundAlpha: 255,
			scrollbarOffsetHorizontal: -4,
			// scrollbarSize: 4,
		});

		if (x) scrollbox.x = x;
		if (y) scrollbox.y = y;

		if (ref) {
			// eslint-disable-next-line no-param-reassign
			ref.current = scrollbox;
		}

		return scrollbox;
	},
	applyProps(scrollbox, _oldProps, _newProps) {
		/* eslint-disable @typescript-eslint/naming-convention */
		const {
			children: oldChildren,
			ref: _oldRef,
			...oldProps
		} = _oldProps;
		/* eslint-enable */
		const {
			children: newChildren,
			ref,
			...newProps
		} = _newProps;

		Object.keys(newProps).forEach((p) => {
			// @ts-ignore
			if (oldProps[p] !== newProps[p]) {
				// @ts-ignore
				scrollbox[p] = newProps[p]; // eslint-disable-line no-param-reassign
			}
		});

		if (ref) {
			ref.current = scrollbox;
		}

		scrollbox.update();
	},
	config: {
		destroy: true,
		destroyChildren: true,
	},
});

export default Scrollbox;
