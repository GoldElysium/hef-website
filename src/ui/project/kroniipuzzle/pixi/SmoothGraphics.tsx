import { PixiComponent } from '@pixi/react';
import { SmoothGraphics as PixiSmoothGraphics } from '@pixi/graphics-smooth';

interface PixiComponentSmoothGraphicsProps {
	width: number;
	height: number;
	draw: (g: PixiSmoothGraphics) => void;
}

const SmoothGraphics = PixiComponent('SmoothGraphics', {
	create({ width, height, draw }: PixiComponentSmoothGraphicsProps) {
		const graphics = new PixiSmoothGraphics();
		graphics.width = width;
		graphics.height = height;
		draw.call(graphics, graphics);

		return graphics;
	},
	applyProps(graphics, _oldProps, _newProps) {
		const { draw: oldDraw, ...oldProps } = _oldProps;
		const { draw: newDraw, ...newProps } = _newProps;

		Object.keys(newProps).forEach((p) => {
			// @ts-ignore
			if (oldProps[p] !== newProps[p]) {
				// @ts-ignore
				graphics[p] = newProps[p]; // eslint-disable-line no-param-reassign
			}
		});

		if (newDraw !== oldDraw && typeof newDraw === 'function') {
			newDraw.call(graphics, graphics);
		}
	},
});

export default SmoothGraphics;
