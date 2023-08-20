// eslint-disable-next-line max-classes-per-file
import { PixiComponent } from '@pixi/react';
import { MutableRefObject } from 'react';
import { AnimatedGIF as PixiAnimatedGIF } from '@pixi/gif';

interface PixiComponentAnimatedGIFProps {
	width?: number;
	height?: number;
	gif: PixiAnimatedGIF;
	x?: number;
	y?: number;
	visible?: boolean;
	ref?: MutableRefObject<PixiAnimatedGIF | null>;
	intermittance?: number;
}

const AnimatedGIF = PixiComponent('AnimatedGIF', {
	create({
		width, height, gif, x, y, visible, ref, intermittance,
	}: PixiComponentAnimatedGIFProps) {
		const animatedGIF = gif;

		if (x) animatedGIF.x = x;
		if (y) animatedGIF.y = y;
		if (width) animatedGIF.width = width;
		if (height) animatedGIF.height = height;
		if (visible) animatedGIF.visible = visible;

		if (intermittance) {
			animatedGIF.loop = false;
			animatedGIF.stop();

			setTimeout(() => {
				animatedGIF.play();
			}, intermittance);

			animatedGIF.onComplete = () => {
				setTimeout(() => {
					animatedGIF.play();
				}, intermittance);
			};
		}

		animatedGIF.hitArea = {
			contains: () => false,
		};

		if (ref) {
			// eslint-disable-next-line no-param-reassign
			ref.current = animatedGIF;
		}

		return animatedGIF;
	},
	applyProps(animatedGIF, _oldProps, _newProps) {
		/* eslint-disable @typescript-eslint/naming-convention */
		const {
			ref: _oldRef,
			gif: _oldGif,
			visible: _oldVisible,
			...oldProps
		} = _oldProps;
		/* eslint-enable */
		const {
			ref,
			gif,
			visible,
			...newProps
		} = _newProps;

		// eslint-disable-next-line no-param-reassign
		animatedGIF.visible = visible ?? true;

		Object.keys(newProps).forEach((p) => {
			// @ts-ignore
			if (oldProps[p] !== newProps[p]) {
				// @ts-ignore
				animatedGIF[p] = newProps[p]; // eslint-disable-line no-param-reassign
			}
		});

		if (ref) {
			ref.current = animatedGIF;
		}
	},
	config: {
		destroy: true,
	},
});

export default AnimatedGIF;
