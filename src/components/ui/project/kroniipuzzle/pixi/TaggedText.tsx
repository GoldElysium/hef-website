import { PixiComponent } from '@pixi/react';
import PixiTaggedText from 'pixi-tagged-text';
import type { TaggedTextOptions, TextStyleSet } from 'pixi-tagged-text/dist/types';
import type { IPointData } from 'pixi.js';

interface PixiComponentTaggedTextProps {
	text: string;
	styles: TextStyleSet;
	options?: TaggedTextOptions;
	x: number;
	y: number;
	width?: number;
	height?: number;
	scale?: IPointData;
	ref?: React.MutableRefObject<PixiTaggedText | null>;
}

const TaggedText = PixiComponent('TaggedText', {
	create({
		text, styles, options, x, y, width, height, scale, ref,
	}: PixiComponentTaggedTextProps) {
		const taggedText = new PixiTaggedText(text, styles, options);
		taggedText.x = x;
		taggedText.y = y;
		if (width) taggedText.width = width;
		if (height) taggedText.height = height;
		if (scale) taggedText.scale = scale;
		taggedText.update();
		taggedText.draw();

		if (ref) {
			// eslint-disable-next-line no-param-reassign
			ref.current = taggedText;
		}

		return taggedText;
	},
	applyProps(taggedText, _oldProps, _newProps) {
		/* eslint-disable @typescript-eslint/naming-convention */
		const {
			styles: _oldStyles,
			options: _oldOptions,
			ref: _oldRef,
			...oldProps
		} = _oldProps;

		const {
			styles,
			options: _options,
			ref,
			...newProps
		} = _newProps;
		/* eslint-enable */

		taggedText.setTagStyles(styles);

		Object.keys(newProps).forEach((p) => {
			// @ts-ignore
			if (oldProps[p] !== newProps[p]) {
				// @ts-ignore
				taggedText[p] = newProps[p]; // eslint-disable-line no-param-reassign
			}
		});

		if (ref) {
			// eslint-disable-next-line no-param-reassign
			ref.current = taggedText;
		}

		taggedText.update();
		taggedText.draw();
	},
	config: {
		destroy: true,
		destroyChildren: true,
	},
});

export default TaggedText;
