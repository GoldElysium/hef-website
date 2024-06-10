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

import { ReactNode } from 'react';
import { tripetto } from '@tripetto/runner';
import { MultipleChoice } from '@tripetto/block-multiple-choice/runner';
import { MultipleChoiceFabric } from '@tripetto/runner-fabric/components/multiple-choice';
import { IFormNodeBlockProps, IFormNodeBlock } from '../../interfaces/block';

@tripetto({
	legacyBlock: true,
	type: 'node',
	identifier: '@tripetto/block-multiple-choice',
	alias: 'multiple-choice',
	autoRender: true,
})
export default class MultipleChoiceBlock extends MultipleChoice implements IFormNodeBlock {
	render(props: IFormNodeBlockProps): ReactNode {
		return (
			<>
				{this.props.imageURL && this.props.imageAboveText && (
					<img src={props.markdownifyToImage(this.props.imageURL)} width={this.props.imageWidth} alt="" />
				)}
				{this.props.caption ? (
					<>
						{props.name && <h3>{props.name}</h3>}
						<span>{props.markdownifyToJSX(this.props.caption)}</span>
					</>
				) : (
					props.name
				)}
				{props.description}
				{this.props.imageURL && !this.props.imageAboveText && (
					<img src={props.markdownifyToImage(this.props.imageURL)} width={this.props.imageWidth} alt="" />
				)}
				<MultipleChoiceFabric
					styles={{
						color: '#000',
					}}
					buttons={this.choices(props)}
					alignment={
						(this.props.alignment === 'equal' || this.props.alignment === 'full' || this.props.alignment === 'columns'
							? this.props.alignment
							: this.props.alignment && 'horizontal') || 'vertical'
					}
					value={(!this.props.multiple && this.valueOf('choice')) || undefined}
					required={this.required}
					ariaDescribedBy={props.ariaDescribedBy}
					onAutoFocus={props.autoFocus}
					onFocus={props.focus}
					onBlur={props.blur}
					onSubmit={props.onSubmit}
				/>
				{props.ariaDescription}
			</>
		);
	}
}
