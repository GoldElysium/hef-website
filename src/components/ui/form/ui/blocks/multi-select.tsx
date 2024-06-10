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
import { MultiSelect } from '@tripetto/block-multi-select/runner';
import { MultiSelectFabric } from '@tripetto/runner-fabric/components/multi-select';
import { IFormNodeBlockProps, IFormNodeBlock } from '../../interfaces/block';

@tripetto({
	legacyBlock: true,
	type: 'node',
	identifier: '@tripetto/block-multi-select',
})
export default class MultiSelectBlock extends MultiSelect implements IFormNodeBlock {
	render(props: IFormNodeBlockProps, done?: () => void, cancel?: () => void): ReactNode {
		return (
			<>
				{props.name}
				{props.description}
				<MultiSelectFabric
					id={props.id}
					overlay={props.overlay}
					styles={{
						backgroundColor: 'transparent',
						borderColor: 'inherit',
						errorColor: '#f00',
					}}
					options={this.options(props)}
					required={this.required}
					error={props.isFailed}
					tabIndex={props.tabIndex}
					placeholder={props.placeholder}
					ariaDescribedBy={props.ariaDescribedBy}
					onAutoFocus={props.autoFocus}
					onFocus={props.focus}
					onBlur={props.blur}
					onSubmit={done}
					onCancel={cancel}
				/>
				{props.ariaDescription}
			</>
		);
	}
}
