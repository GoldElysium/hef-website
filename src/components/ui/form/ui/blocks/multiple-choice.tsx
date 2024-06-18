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
	ReactNode, FocusEvent, useEffect, useRef, useState,
} from 'react';
import {
	tripetto,
	TSerializeTypes, arrayItem, cancelUITimeout, castToBoolean, each, findFirst, scheduleUITimeout,
} from '@tripetto/runner';
import { MultipleChoice } from '@tripetto/block-multiple-choice/runner';
import { IMultipleChoiceButton } from '@tripetto/runner-fabric/components/multiple-choice';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/20/solid';
import { color } from '@tripetto/runner-fabric';
import { IFormNodeBlockProps, IFormNodeBlock } from '../../interfaces/block';
import { DEBOUNCE_NORMAL } from '../../util/const';
import { handleAutoSubmit } from '../../util/helpers';

const assertValue = (
	valueRef: {
		reference?: string;
		readonly set: (value: TSerializeTypes, reference?: string, display?: string) => void;
	},
	buttons: IMultipleChoiceButton[],
	reference?: string,
) => {
	const selected = findFirst(buttons, (button) => button.id === reference);

	if (valueRef.reference !== selected?.id) {
		valueRef.set(selected && (selected.value || selected.name), selected?.id, selected?.name);
	}

	return (selected && selected.id) || '';
};

/* eslint-disable react/destructuring-assignment */
function MultipleChoiceFabric(props: {
	readonly buttons: IMultipleChoiceButton[];
	readonly alignment?: 'vertical' | 'equal' | 'full' | 'columns' | 'horizontal';
	readonly required?: boolean;
	readonly disabled?: boolean;
	readonly readOnly?: boolean;
	readonly ariaDescribedBy?: string;
	readonly tabIndex?: number;
	readonly value?:
	| string
	| {
		reference?: string;
		readonly isLocked: boolean;
		readonly isFrozen: boolean;
		readonly set: (value: TSerializeTypes, reference?: string, display?: string) => void;
	};
	readonly autoSubmit?: boolean;
	readonly view?: 'live' | 'test' | 'preview';
	readonly onChange?: (value: string) => void;
	readonly onFocus?: (e: FocusEvent) => void;
	readonly onBlur?: (e: FocusEvent) => void;
	readonly onAutoFocus?: (el: HTMLButtonElement | null) => void;
	readonly onSubmit?: () => void;
	readonly onCancel?: () => void;
}) {
	const valueRef = props.value;
	const debounceRef = useRef<number>(0);
	const buttonsRef = useRef<{
		[button: string]: boolean;
	}>({});
	const [proxy, setProxy] = useState((typeof valueRef !== 'object' && valueRef) || '');
	const [value, setValue] = typeof valueRef === 'object'
		? [
			debounceRef.current !== 0 ? proxy : assertValue(valueRef, props.buttons, valueRef.reference),
			(reference: string) => {
				cancelUITimeout(debounceRef.current);

				setProxy(reference);

				debounceRef.current = scheduleUITimeout(() => {
					debounceRef.current = 0;

					assertValue(valueRef, props.buttons, reference);

					if (props.autoSubmit && reference) {
						// eslint-disable-next-line @typescript-eslint/no-use-before-define
						handleAutoSubmit(autoSubmit);
					}
				}, DEBOUNCE_NORMAL);
			},
		]
		: [proxy, setProxy];
	const [, update] = useState({});
	const autoSubmit = useRef({
		id: 0,
		cb: props.onSubmit,
	});

	const toggle = (button: IMultipleChoiceButton) => {
		if (button.url) {
			return;
		}

		const isSelected = button.slot
			? castToBoolean(buttonsRef.current[button.id], button.slot.value) : value === button.id;

		if (button.slot) {
			cancelUITimeout(debounceRef.current);

			buttonsRef.current[button.id] = !isSelected;

			update({});

			debounceRef.current = scheduleUITimeout(() => {
				debounceRef.current = 0;

				each(
					buttonsRef.current,
					(val, id: string) => {
						const changedButton = findFirst(props.buttons, (ref) => ref.id === id);

						delete buttonsRef.current[id];

						if (changedButton && changedButton.slot) {
							changedButton.slot.value = val;
						}
					},
					{
						keys: true,
					},
				);
			}, DEBOUNCE_NORMAL);
		} else {
			const val = isSelected && !props.required ? '' : button.id;

			if (autoSubmit.current.id) {
				clearTimeout(autoSubmit.current.id);

				autoSubmit.current.id = 0;
			}

			setValue(val);

			if (props.onChange) {
				props.onChange(val);
			}

			if (typeof valueRef !== 'object' && props.autoSubmit && val) {
				handleAutoSubmit(autoSubmit);
			}
		}

		if (button.onChange) {
			button.onChange(!button.slot && props.required ? true : !isSelected);
		}
	};

	useEffect(() => () => {
		cancelUITimeout(debounceRef.current);
	}, []);

	autoSubmit.current.cb = props.onSubmit;

	return (
		<div
			className={`table ${props.alignment === 'equal' ? 'w-full' : ''}`}
		>
			{props.buttons.map((button, index) => {
				const isSelected = button.slot
					? castToBoolean(buttonsRef.current[button.id], button.slot.value) : value === button.id;

				if (button.slot) {
					button.slot.confirm();
				}

				const bwButtonColor = button.color
					? color(button.color, (o) => o.makeBlackOrWhite())
					: undefined;

				return (
					(props.view === 'preview' || button.name || button.description) && (
						<button
							type="button"
							key={button.id || index}
							className={`mt-2 flex items-center gap-2 rounded-lg border px-4 py-2 hover:shadow-[0_0_0_0.2rem_rgba(0,0,0,0.2)] active:shadow-[0_0_0_0.2rem_rgba(0,0,0,0.2)] dark:hover:shadow-[0_0_0_0.2rem_rgba(255,255,255,0.2)] dark:active:shadow-[0_0_0_0.2rem_rgba(255,255,255,0.2)] ${
								isSelected
									? 'border-skin-primary-foreground bg-skin-primary text-skin-primary-foreground dark:border-skin-primary-foreground-dark dark:bg-skin-primary-dark dark:text-skin-primary-foreground-dark'
									: 'border-skin-primary dark:border-skin-primary-dark'
							}`}
							style={{
								borderColor: isSelected ? bwButtonColor : button.color,
								color: isSelected ? bwButtonColor : undefined,
								backgroundColor: isSelected ? button.color : undefined,
							}}
							tabIndex={button.tabIndex || props.tabIndex}
							aria-describedby={props.ariaDescribedBy}
							disabled={
								button.disabled
								|| props.disabled
								|| props.readOnly
								|| (typeof valueRef === 'object' && (valueRef.isFrozen || valueRef.isLocked))
								|| (button.slot && (button.slot.isFrozen || button.slot.isLocked))
								|| false
							}
							// eslint-disable-next-line max-len
							ref={((button.slot || !value ? index === 0 : isSelected) && props.onAutoFocus) || undefined}
							onFocus={props.onFocus}
							onBlur={props.onBlur}
							onKeyDown={(e) => {
								if (e.shiftKey && e.key === 'Enter' && props.onSubmit) {
									e.preventDefault();

									props.onSubmit();
								} else if (e.key === 'Escape') {
									e.currentTarget.blur();
								} else if (e.key === 'Tab') {
									if (e.shiftKey) {
										if (props.onCancel && index === 0) {
											e.preventDefault();

											props.onCancel();
										}
									} else if (props.onSubmit && index + 1 === props.buttons.length) {
										e.preventDefault();

										props.onSubmit();
									}
								} else {
									const keyCode = (e.key.length === 1 && e.key.charCodeAt(0)) || 0;
									const offset = (keyCode <= 57 ? keyCode - 48 : 0)
										|| (keyCode <= 90 ? keyCode - 64 : 0)
										|| (keyCode <= 122 ? keyCode - 96 : 0);

									if (offset > 0 && offset <= 26) {
										const toggleButton = arrayItem(props.buttons, offset - 1);

										if (toggleButton) {
											toggle(toggleButton);
										}
									}
								}
							}}
							onClick={(e) => {
								e.stopPropagation();

								if (button.url) {
									window.open(button.url, `_${button.target || 'self'}`, 'noopener');
								} else {
									toggle(button);
								}
							}}
						>
							{button.label || button.name || '...'}
							{button.description && <small className="text-sm">{button.description}</small>}
							{(button.url && button.target !== 'self' && <ArrowTopRightOnSquareIcon className="size-4" />)}
						</button>
					)
				);
			})}
		</div>
	);
}

/* eslint-enable */

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
