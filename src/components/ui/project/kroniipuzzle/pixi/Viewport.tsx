// eslint-disable-next-line max-classes-per-file
import { PixiComponent } from '@pixi/react';
import type { Application, Rectangle } from 'pixi.js';
import * as PIXI from 'pixi.js';
import { InputManager as PixiViewportInputManager, IViewportOptions, Viewport as PixiViewport } from 'pixi-viewport';
import type * as React from 'react';
import { MutableRefObject } from 'react';
import { SIDEBAR_WIDTH } from '../puzzle/PuzzleConfig';

class FixedInputManager extends PixiViewportInputManager {
	public override handleWheel(event: WheelEvent): void {
		if (this.viewport.pause || !this.viewport.worldVisible) {
			return;
		}

		// only handle wheel events where the mouse is over the viewport
		const point = this.viewport.toLocal(this.getPointerPosition(event));

		// Modify the function to only zoom whenever the user is not scrolling on the sidebar
		if (
			SIDEBAR_WIDTH <= event.x
			&& this.viewport.left <= point.x
			&& point.x <= this.viewport.right
			&& this.viewport.top <= point.y
			&& point.y <= this.viewport.bottom) {
			const stop = this.viewport.plugins.wheel(event);

			if (stop && !this.viewport.options.passiveWheel) {
				event.preventDefault();
			}
		}
	}
}

class FixedPixiViewport extends PixiViewport {
	public override readonly input: FixedInputManager;

	constructor(options: IViewportOptions) {
		super(options);
		// Destroy the input manager created by the super call
		// @ts-expect-error
		this.input.destroy();

		// Create our own
		this.input = new FixedInputManager(this);
	}
}

interface PixiComponentViewportProps {
	width?: number;
	height?: number;
	worldWidth?: number;
	worldHeight?: number;
	disableDragging?: boolean;
	x?: number;
	y?: number;
	forceHitArea?: Rectangle | undefined | null;
	app: Application;
	children?: React.ReactNode;
	ref?: MutableRefObject<PixiViewport | null>
}

const Viewport = PixiComponent('Viewport', {
	create({
		width, height, worldWidth, worldHeight, forceHitArea, x, y, app, ref,
	}: PixiComponentViewportProps) {
		if (!('events' in app.renderer)) {
			// @ts-ignore
			app.renderer.addSystem(PIXI.EventSystem, 'events');
		}

		const viewport = new FixedPixiViewport({
			screenWidth: width,
			screenHeight: height,
			worldWidth: worldWidth ?? width,
			worldHeight: worldHeight ?? height,
			forceHitArea,
			ticker: app.ticker,
			events: app.renderer.events,
			passiveWheel: true,
		});
		if (x) viewport.x = x;
		if (y) viewport.y = y;

		viewport
			.drag()
			.pinch()
			.decelerate()
			.wheel()
			.bounce({
				// @ts-ignore
				bounceBox: {
					x: -viewport.worldWidth,
					width: viewport.worldWidth * 2,
					y: -viewport.worldHeight,
					height: viewport.worldHeight * 2,
				},
			})
			.clamp({
				left: -(viewport.worldWidth / 2),
				right: viewport.worldWidth * 1.5,
				top: -(viewport.worldHeight / 2),
				bottom: viewport.worldHeight * 1.5,
				underflow: 'none',
			})
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
	willUnmount(instance: PixiViewport) {
		// workaround because the ticker is already destroyed by this point by the stage
		// eslint-disable-next-line no-param-reassign
		instance.options.noTicker = true;
		try {
			instance.destroy({ children: true, texture: true, baseTexture: true });
		} catch { /* */ }
	},
	config: {
		destroy: false,
		destroyChildren: false,
	},
});

export default Viewport;
