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

import {
	ReactNode, ChangeEvent, FocusEvent, KeyboardEvent, useEffect, useRef, useState,
} from 'react';
import {
	tripetto,
	TSerializeTypes, cancelUITimeout, findFirst, scheduleUITimeout,
} from '@tripetto/runner';
import { Dropdown } from '@tripetto/block-dropdown/runner';
import { IFormNodeBlock, IFormNodeBlockProps } from '@/components/ui/form/interfaces/block';
import { IDropdownFabricOption } from '@tripetto/runner-fabric';
import { DEBOUNCE_NORMAL } from '../../util/const';

const assertValue = (
	valueRef: {
		reference?: string;
		readonly set: (value: TSerializeTypes, reference?: string, display?: string) => void;
		readonly default: (value: TSerializeTypes, reference?: string, display?: string) => void;
	},
	props: {
		readonly options: IDropdownFabricOption[];
		readonly placeholder?: string;
	},
	reference?: string,
) => {
	const selected = findFirst(props.options, (option) => option.id === reference);

	if (!selected && !props.placeholder && props.options.length > 0) {
		const defaultOption = findFirst(props.options, (option) => (!!option.name));

		if (defaultOption) {
			valueRef.default(
				defaultOption.value || defaultOption.name,
				defaultOption.id,
				defaultOption.name,
			);
		}
	} else if (valueRef.reference !== selected?.id) {
		valueRef.set(selected && (selected.value || selected.name), selected?.id, selected?.name);
	}

	return (selected && selected.id) || '';
};

/* eslint-disable react/destructuring-assignment,react/no-unused-prop-types */
function DropdownFabric(props: {
	readonly id?: string;
	readonly options: IDropdownFabricOption[];
	readonly placeholder?: string;
	readonly required?: boolean;
	readonly disabled?: boolean;
	readonly readOnly?: boolean;
	readonly error?: boolean;
	readonly tabIndex?: number;
	readonly value?:
	| string
	| {
		reference?: string;
		readonly isLocked: boolean;
		readonly isFrozen: boolean;
		readonly set: (value: TSerializeTypes, reference?: string, display?: string) => void;
		readonly default: (value: TSerializeTypes, reference?: string, display?: string) => void;
	};
	readonly ariaDescribedBy?: string;
	readonly onChange?: (value: string) => void;
	readonly onFocus?: (e: FocusEvent) => void;
	readonly onBlur?: (e: FocusEvent) => void;
	readonly onAutoFocus?: (el: HTMLSelectElement | null) => void;
	readonly onSubmit?: () => void;
	readonly onCancel?: () => void;
}) {
	const valueRef = props.value;
	const debounceRef = useRef<number>(0);
	const [proxy, setProxy] = useState((typeof valueRef !== 'object' && valueRef) || '');
	const [value, setValue] =		typeof valueRef === 'object'
		? [
			debounceRef.current !== 0 ? proxy : assertValue(valueRef, props, valueRef.reference),
			(reference: string) => {
				cancelUITimeout(debounceRef.current);

				setProxy(reference);

				debounceRef.current = scheduleUITimeout(() => {
					debounceRef.current = 0;

					assertValue(valueRef, props, reference);
				}, DEBOUNCE_NORMAL);
			},
		]
		: [proxy, setProxy];
	const [, makeErrorVisible] = useState(!!value);

	useEffect(() => () => {
		cancelUITimeout(debounceRef.current);
	}, []);

	return (
		<select
			className="rounded-lg border border-skin-primary bg-white px-4 py-2 dark:border-skin-primary-dark dark:bg-[#2b2a33]"
			id={props.id}
			ref={props.onAutoFocus}
			tabIndex={props.tabIndex}
			required={props.required || false}
			disabled={
				props.disabled || props.readOnly || (typeof valueRef === 'object' && (valueRef.isFrozen || valueRef.isLocked)) || false
			}
			value={value}
			aria-describedby={props.ariaDescribedBy}
			onChange={(e: ChangeEvent<HTMLSelectElement>) => {
				setValue(e.target.value);
				makeErrorVisible(true);

				if (props.onChange) {
					props.onChange(e.target.value);
				}
			}}
			onFocus={props.onFocus}
			onBlur={props.onBlur}
			onKeyDown={(e: KeyboardEvent<HTMLSelectElement>) => {
				if (e.shiftKey && e.key === 'Enter' && props.onSubmit) {
					e.preventDefault();

					props.onSubmit();
				} else if (e.key === 'Escape') {
					e.currentTarget.blur();
				} else if (e.key === 'Tab') {
					if (e.shiftKey) {
						if (props.onCancel) {
							e.preventDefault();

							props.onCancel();
						}
					} else if (props.onSubmit) {
						e.preventDefault();

						props.onSubmit();
					}
				}
			}}
		>
			{props.placeholder && (
				<option
					value=""
				>
					{props.placeholder}
				</option>
			)}
			{props.options.map(
				(option, index) => option.name
					&& option.id && (
				// eslint-disable-next-line react/no-array-index-key
					<option key={index} value={option.id}>
						{option.name}
					</option>
				),
			)}
		</select>
	);
}
/* eslint-enable */

@tripetto({
	legacyBlock: true,
	type: 'node',
	identifier: '@tripetto/block-dropdown',
})
export default class DropdownBlock extends Dropdown implements IFormNodeBlock {
	render(props: IFormNodeBlockProps): ReactNode {
		return (
			<>
				{props.name}
				{props.description}
				<DropdownFabric
					id={props.id}
					options={this.options}
					value={this.dropdownSlot}
					required={this.required}
					error={props.isFailed}
					tabIndex={props.tabIndex}
					placeholder={props.placeholder}
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
