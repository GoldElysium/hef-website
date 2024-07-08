// eslint-disable-next-line max-classes-per-file
import { PixiComponent, applyDefaultProps } from '@pixi/react';
import { AnimatedGIF as PixiAnimatedGIF } from '@pixi/gif';

interface PixiComponentAnimatedGIFProps {
	width?: number;
	height?: number;
	gif: PixiAnimatedGIF;
	x?: number;
	y?: number;
	visible?: boolean;
	intermittance?: number;
}

const AnimatedGIF = PixiComponent('AnimatedGIF', {
	create({
		width, height, gif, x, y, visible, intermittance,
	}: PixiComponentAnimatedGIFProps) {
		const animatedGIF = gif;

		if (x) animatedGIF.x = x;
		if (y) animatedGIF.y = y;
		if (width) animatedGIF.width = width;
		if (height) animatedGIF.height = height;
		if (visible) animatedGIF.visible = visible && !intermittance;

		if (intermittance) {
			animatedGIF.loop = false;

			// note: this is to get rid of the "peeking" animations on initial run
			animatedGIF.play();

			setTimeout(() => {
				animatedGIF.visible = true;
				animatedGIF.play();
			}, intermittance);

			animatedGIF.onComplete = () => {
				animatedGIF.visible = false;

				setTimeout(() => {
					animatedGIF.visible = true;
					animatedGIF.play();
				}, intermittance);
			};
		}

		animatedGIF.hitArea = {
			contains: () => false,
		};

		return animatedGIF;
	},
	applyProps(animatedGIF, _oldProps, _newProps) {
		/* eslint-disable @typescript-eslint/naming-convention */
		const {
			gif: _oldGif,
			visible: _oldVisible,
			...oldProps
		} = _oldProps;
		/* eslint-enable */
		const {
			gif,
			visible,
			...newProps
		} = _newProps;

		// eslint-disable-next-line no-param-reassign
		animatedGIF.visible = visible ?? true;

		applyDefaultProps(animatedGIF, oldProps, newProps);
	},
	config: {
		destroy: true,
	},
});

export default AnimatedGIF;
