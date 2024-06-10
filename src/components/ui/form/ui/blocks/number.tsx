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
	ChangeEvent, FocusEvent, KeyboardEvent, ReactNode, useEffect, useRef, useState,
} from 'react';
import {
	cancelUITimeout,
	castToFloat,
	castToString,
	DateTime,
	isNumberFinite,
	L10n,
	Num,
	scheduleUITimeout,
	Str,
	tripetto,
	TSerializeTypes,
} from '@tripetto/runner';
import { Number } from '@tripetto/block-number/runner';
import { IFormNodeBlockProps, IFormNodeBlock } from '../../interfaces/block';
import { DEBOUNCE_MAX, DEBOUNCE_MIN } from '../../util/const';
import { handleBlur, handleFocus, setReturnValue } from '../../helpers';

/* eslint-disable react/destructuring-assignment */
function NumberFabric(props: {
	readonly l10n?: L10n.Namespace;
	readonly id?: string;
	readonly precision?: number;
	readonly placeholder?: string;
	readonly required?: boolean;
	readonly disabled?: boolean;
	readonly readOnly?: boolean;
	readonly error?: boolean;
	readonly tabIndex?: number;
	readonly maxLength?: number;
	readonly value?:
	| number
	| {
		pristine: TSerializeTypes;
		readonly value: number;
		readonly string: string;
		readonly hasValue: boolean;
		readonly isLocked: boolean;
		readonly isFrozen: boolean;
		readonly slot: {
			readonly precision?: number;
			readonly digits?: number;
			readonly minimum?: number;
			readonly maximum?: number;
			readonly separator?: string;
			readonly formatString: (value: string, plural: boolean) => string;
			readonly toValue: (value: string) => number;
		};
	};
	readonly ariaDescribedBy?: string;
	readonly onChange?: (value: string) => string | void;
	readonly onFocus?: (e: FocusEvent) => string | void;
	readonly onBlur?: (e: FocusEvent) => string | void;
	readonly onAutoFocus?: (el: HTMLInputElement | null) => void;
	readonly onSubmit?: () => void;
	readonly onCancel?: () => void;
}) {
	const valueRef = props.value;
	const debounceRef = useRef<{
		duration: number;
		handle: number;
		update?:() => void;
	}>({
				duration: 0,
				handle: 0,
			});
	const [type, setType] = useState<'text' | 'number'>('text');
	const [focus, setFocus] = useState(false);
	const [focusValue, setFocusValue] = useState(
		// eslint-disable-next-line no-nested-ternary
		typeof valueRef === 'object' ? castToString(valueRef.pristine) : typeof valueRef === 'number' ? valueRef.toString() : '',
	);
	const [value, setValue] = typeof valueRef === 'object'
		? [
			// eslint-disable-next-line no-nested-ternary
			focus
				? focusValue
				: valueRef.hasValue
					? valueRef.slot.formatString(
						valueRef.slot.digits
							? Str.padLeft(valueRef.value, '0', valueRef.slot.digits, false, true)
							// eslint-disable-next-line react/destructuring-assignment
							: (props.l10n?.locale || L10n.Locales).number(
								valueRef.value,
								valueRef.slot.precision,
								(valueRef.slot.separator && true) || false,
							),
						valueRef.value !== 1,
					)
					: '',
			(val: string) => {
				cancelUITimeout(debounceRef.current.handle);

				setFocusValue(val);

				const nTimeout = Num.range(debounceRef.current.duration * 2, DEBOUNCE_MIN, DEBOUNCE_MAX);

				debounceRef.current.handle = scheduleUITimeout(() => {
					const start = DateTime.precise;

					debounceRef.current.handle = 0;
					debounceRef.current.update = () => {
						debounceRef.current.duration = DateTime.elapsed(start, true);
						debounceRef.current.update = undefined;
					};
					valueRef.pristine = val !== '' ? valueRef.slot.toValue(val) : undefined;
					valueRef.pristine = val || undefined;
				}, nTimeout);
			},
		]
		: [focusValue, setFocusValue];
	const [, makeErrorVisible] = useState(!!value);
	const focusRef = useRef(0);
	const currentValue = focus && typeof valueRef === 'object' ? castToFloat(focusValue) : 0;

	const error = props.error
		|| (focus
			&& typeof valueRef === 'object'
			&& ((isNumberFinite(valueRef.slot.minimum) && currentValue < valueRef.slot.minimum)
				|| (isNumberFinite(valueRef.slot.maximum) && currentValue > valueRef.slot.maximum)))
		|| false;

	useEffect(() => () => {
		cancelUITimeout(debounceRef.current.handle);
	}, []);

	if (debounceRef.current.update) {
		debounceRef.current.update();
	}

	return (
		<input
			id={props.id}
			className={`rounded-lg px-4 py-2 ${error ? 'border-2 border-red-600' : 'border border-black'}`}
			ref={props.onAutoFocus}
			type={type}
			tabIndex={props.tabIndex}
			placeholder={props.placeholder}
			required={props.required || false}
			disabled={props.disabled || false}
			readOnly={props.readOnly || (typeof valueRef === 'object' && (valueRef.isFrozen || valueRef.isLocked)) || false}
			maxLength={props.maxLength}
			value={value}
			autoComplete="off"
			step={
				type === 'number'
					? (typeof valueRef === 'object' && valueRef.slot.precision && `0.${Str.fill('0', valueRef.slot.precision - 1)}1`) || '1'
					: undefined
			}
			inputMode={props.precision || (typeof valueRef === 'object' && valueRef.slot.precision) ? 'decimal' : 'numeric'}
			aria-describedby={props.ariaDescribedBy}
			onChange={(e: ChangeEvent<HTMLInputElement>) => {
				setValue(e.target.value);
				makeErrorVisible(true);

				if (props.onChange) {
					setReturnValue(setValue, props.onChange(e.target.value));
				}
			}}
			onFocus={(e: FocusEvent<HTMLInputElement>) => {
				if (focusRef.current) {
					cancelAnimationFrame(focusRef.current);

					focusRef.current = 0;
				}

				if (type === 'text') {
					const el = e.target;

					/** In Firefox we lose focus when switching input type. */
					requestAnimationFrame(() => {
						el.focus();
					});

					setType('number');
				}

				handleFocus(setFocus, setValue, props.onFocus)(e);
			}}
			onBlur={(e: FocusEvent<HTMLInputElement>) => {
				focusRef.current = requestAnimationFrame(() => {
					focusRef.current = 0;

					if (type === 'number') {
						setType('text');
					}

					if (typeof valueRef === 'object' && valueRef.hasValue) {
						setFocusValue(castToString(valueRef.pristine));
					}

					handleBlur(setFocus, setValue, props.onBlur)(e);
				});
			}}
			onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
				if (e.key === 'Enter' && props.onSubmit) {
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
		/>
	);
}
/* eslint-enable */

@tripetto({
	legacyBlock: true,
	type: 'node',
	identifier: '@tripetto/block-number',
})
export default class NumberBlock extends Number implements IFormNodeBlock {
	render(props: IFormNodeBlockProps): ReactNode {
		return (
			<>
				{props.name}
				{props.description}
				<NumberFabric
					id={props.id}
					l10n={props.l10n}
					value={this.numberSlot}
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
