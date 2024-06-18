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
	ReactNode, FocusEvent, KeyboardEvent, useEffect, useRef, useState,
} from 'react';
import {
	tripetto, TSerializeTypes, cancelUITimeout, scheduleUITimeout,
} from '@tripetto/runner';
import { YesNo } from '@tripetto/block-yes-no/runner';
import { IYesNo } from '@tripetto/runner-fabric/components/yes-no';
import { color } from '@tripetto/runner-fabric';
import { IFormNodeBlockProps, IFormNodeBlock } from '../../interfaces/block';
import { handleAutoSubmit } from '../../util/helpers';
import { DEBOUNCE_NORMAL } from '../../util/const';

const assertValue = (
	valueRef: {
		reference?: string;
		readonly set: (value: TSerializeTypes, reference?: string, display?: string) => void;
		readonly clear: () => void;
	},
	reference: string | undefined,
	labels: {
		readonly yes: IYesNo;
		readonly no: IYesNo;
	},
) => {
	if (reference === 'yes' || reference === 'no') {
		if (valueRef.reference !== reference) {
			const value = reference === 'yes' ? labels.yes.label : labels.no.label;

			valueRef.set(value, reference, value);
		}

		return reference;
	}

	valueRef.clear();

	return '';
};

/* eslint-disable react/destructuring-assignment */
function YesNoFabric(props: {
	readonly yes: IYesNo;
	readonly no: IYesNo;
	readonly required?: boolean;
	readonly disabled?: boolean;
	readonly readOnly?: boolean;
	readonly ariaDescribedBy?: string;
	readonly tabIndex?: number;
	readonly value?:
	| ''
	| 'yes'
	| 'no'
	| {
		reference?: string;
		readonly isLocked: boolean;
		readonly isFrozen: boolean;
		readonly set: (value: TSerializeTypes, reference?: string, display?: string) => void;
		readonly clear: () => void;
	};
	readonly autoSubmit?: boolean;
	readonly onChange?: (value: '' | 'yes' | 'no') => void;
	readonly onFocus?: (e: FocusEvent) => void;
	readonly onBlur?: (e: FocusEvent) => void;
	readonly onAutoFocus?: (el: HTMLButtonElement | null) => void;
	readonly onSubmit?: () => void;
	readonly onCancel?: () => void;
}) {
	const valueRef = props.value;
	const debounceRef = useRef<number>(0);
	const [proxy, setProxy] = useState<'yes' | 'no' | ''>((typeof valueRef !== 'object' && valueRef) || '');
	const [value, setValue] =		typeof valueRef === 'object'
		? [
			debounceRef.current !== 0 ? proxy : assertValue(valueRef, valueRef.reference, props),
			(val: 'yes' | 'no' | '') => {
				cancelUITimeout(debounceRef.current);

				setProxy(val);

				debounceRef.current = scheduleUITimeout(() => {
					debounceRef.current = 0;

					assertValue(valueRef, val, props);

					if (props.autoSubmit && val) {
						// eslint-disable-next-line @typescript-eslint/no-use-before-define
						handleAutoSubmit(autoSubmit);
					}
				}, DEBOUNCE_NORMAL);
			},
		]
		: [proxy, setProxy];
	const autoSubmit = useRef({
		id: 0,
		cb: props.onSubmit,
	});

	const changeValue = (val: 'yes' | 'no' | false) => {
		if (autoSubmit.current.id) {
			clearTimeout(autoSubmit.current.id);

			autoSubmit.current.id = 0;
		}

		setValue(val || '');

		if (props.onChange) {
			props.onChange(val || '');
		}

		if (typeof valueRef !== 'object' && props.autoSubmit && val) {
			handleAutoSubmit(autoSubmit);
		}
	};

	const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>, b: 'yes' | 'no') => {
		if (
			e.key === 'y'
			|| e.key === 'Y'
			|| e.key === props.yes.label.charAt(0).toLowerCase()
			|| e.key === props.yes.label.charAt(0).toUpperCase()
		) {
			e.preventDefault();

			changeValue('yes');
		} else if (
			e.key === 'n'
			|| e.key === 'N'
			|| e.key === props.no.label.charAt(0).toLowerCase()
			|| e.key === props.no.label.charAt(0).toUpperCase()
		) {
			e.preventDefault();

			changeValue('no');
		} else if (e.shiftKey && e.key === 'Enter' && props.onSubmit) {
			e.preventDefault();

			props.onSubmit();
		} else if (e.key === 'Escape') {
			e.currentTarget.blur();
		} else if (e.key === 'Tab') {
			if (e.shiftKey) {
				if (b === 'yes' && props.onCancel) {
					e.preventDefault();

					props.onCancel();
				}
			} else if (b === 'no' && props.onSubmit) {
				e.preventDefault();

				props.onSubmit();
			}
		}
	};

	useEffect(() => () => {
		cancelUITimeout(debounceRef.current);
	}, []);

	autoSubmit.current.cb = props.onSubmit;

	const bwYesButtonColor = props.yes.color
		? color(props.yes.color, (o) => o.makeBlackOrWhite())
		: undefined;

	const bwNoButtonColor = props.no.color
		? color(props.no.color, (o) => o.makeBlackOrWhite())
		: undefined;

	return (
		<div>
			<button
				className={`rounded-l-md border-2 px-4 py-1.5 ${
					value === 'yes'
						? 'border-white bg-green-700 text-white'
						: 'border-green-700'
				}`}
				style={{
					borderColor: value === 'yes' ? bwYesButtonColor : props.yes.color,
					color: value === 'yes' ? bwYesButtonColor : undefined,
					backgroundColor: value === 'yes' ? props.yes.color : undefined,
				}}
				type="button"
				tabIndex={props.tabIndex}
				aria-describedby={props.ariaDescribedBy}
				disabled={
					props.disabled || props.readOnly || (typeof valueRef === 'object' && (valueRef.isFrozen || valueRef.isLocked)) || false
				}
				ref={((!value || value === 'yes') && props.onAutoFocus) || undefined}
				onFocus={props.onFocus}
				onBlur={props.onBlur}
				onKeyDown={(e) => handleKeyDown(e, 'yes')}
				onClick={() => changeValue((props.required || value !== 'yes') && 'yes')}
			>
				{props.yes.label}
			</button>
			<button
				className={`rounded-r-md border-2 border-l-0 px-4 py-1.5 ${
					value === 'no'
						? 'border-l-2 border-white bg-red-700 text-white'
						: 'border-red-700'
				}`}
				style={{
					borderColor: value === 'no' ? bwNoButtonColor : props.no.color,
					color: value === 'no' ? bwNoButtonColor : undefined,
					backgroundColor: value === 'no' ? props.no.color : undefined,
				}}
				type="button"
				tabIndex={props.tabIndex}
				aria-describedby={props.ariaDescribedBy}
				disabled={
					props.disabled || props.readOnly || (typeof valueRef === 'object' && (valueRef.isFrozen || valueRef.isLocked)) || false
				}
				ref={(value === 'no' && props.onAutoFocus) || undefined}
				onFocus={props.onFocus}
				onBlur={props.onBlur}
				onKeyDown={(e) => handleKeyDown(e, 'no')}
				onClick={() => changeValue((props.required || value !== 'no') && 'no')}
			>
				{props.no.label}
			</button>
		</div>
	);
}
/* eslint-enable */

@tripetto({
	legacyBlock: true,
	type: 'node',
	identifier: '@tripetto/block-yes-no',
	alias: 'yes-no',
})
export default class YesNoBlock extends YesNo implements IFormNodeBlock {
	render(props: IFormNodeBlockProps): ReactNode {
		return (
			<>
				{this.props.imageURL && this.props.imageAboveText && (
					<img src={props.markdownifyToURL(this.props.imageURL)} width={this.props.imageWidth} alt="" />
				)}
				{props.name}
				{props.description}
				{this.props.imageURL && !this.props.imageAboveText && (
					<img src={props.markdownifyToURL(this.props.imageURL)} width={this.props.imageWidth} alt="" />
				)}
				<YesNoFabric
					value={this.answerSlot}
					yes={{
						label: props.markdownifyToString(this.props.altYes || '') || 'Yes',
						color: this.props.colorYes,
					}}
					no={{
						label: props.markdownifyToString(this.props.altNo || '') || 'No',
						color: this.props.colorNo,
					}}
					required={this.required}
					tabIndex={props.tabIndex}
					ariaDescribedBy={props.ariaDescribedBy}
					onAutoFocus={props.autoFocus}
					onSubmit={props.onSubmit}
				/>
				{props.ariaDescription}
			</>
		);
	}
}
