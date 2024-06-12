/* eslint-disable max-len */
/* Based on components provided by @tripetto/runner-fabric and @tripetto/runner-classic */
/*
Copyright 2019 Tripetto B.V.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
/*
MIT License

Copyright (c) 2021 GoldElysium

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
 */
/* eslint-enable */

import { Paragraph } from '@tripetto/block-paragraph/runner';
import { tripetto } from '@tripetto/runner';
import { ReactNode } from 'react';
import ReactPlayer from 'react-player/lazy';
import { IFormNodeBlockProps, IFormNodeBlock } from '../../interfaces/block';

@tripetto({
	legacyBlock: true,
	type: 'node',
	identifier: '@tripetto/block-paragraph',
	alias: 'paragraph',
})
export default class ParagraphBlock extends Paragraph implements IFormNodeBlock {
	render(props: IFormNodeBlockProps): ReactNode {
		return (
			<>
				{this.props.imageURL && this.props.imageAboveText && (
					<img src={props.markdownifyToImage(this.props.imageURL)} width={this.props.imageWidth} alt="" />
				)}
				{props.name && <h3>{props.name}</h3>}
				{this.props.caption && <span>{props.markdownifyToJSX(this.props.caption)}</span>}
				{props.description}
				{this.props.imageURL && !this.props.imageAboveText && (
					<img src={props.markdownifyToImage(this.props.imageURL)} width={this.props.imageWidth} alt="" />
				)}
				{this.props.video && (
					// This ensures a 16:9 aspect ratio
					<div className="relative mb-4 h-0 w-full max-w-full pb-[56.25%]">
						<div className="absolute left-0 top-0 size-full">
							<ReactPlayer
								url={props.markdownifyToURL(this.props.video)}
								width="100%"
								height="100%"
								controls
								light
								className="my-4"
							/>
						</div>
					</div>
				)}
				{props.ariaDescription}
			</>
		);
	}
}
