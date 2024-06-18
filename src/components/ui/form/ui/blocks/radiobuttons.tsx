import {
	ReactNode, FocusEvent, useEffect, useRef, useState,
} from 'react';
import {
	tripetto,
	SHA2, TSerializeTypes, cancelUITimeout, findFirst, scheduleUITimeout,
} from '@tripetto/runner';
import { Radiobuttons } from '@tripetto/block-radiobuttons/runner';
import { IRadiobutton } from '@tripetto/runner-fabric/components/radiobuttons';
import { IFormNodeBlock, IFormNodeBlockProps } from '@/components/ui/form/interfaces/block';
import { DEBOUNCE_NORMAL } from '../../util/const';

const assertValue = (
	valueRef: {
		reference?: string;
		readonly set: (value: TSerializeTypes, reference?: string, display?: string) => void;
	},
	props: {
		readonly buttons: IRadiobutton[];
	},
	reference?: string,
) => {
	const selected = findFirst(props.buttons, (radiobutton) => radiobutton.id === reference);

	if (valueRef.reference !== selected?.id) {
		valueRef.set(selected && (selected.value || selected.name), selected?.id, selected?.name);
	}

	return (selected && selected.id) || '';
};

let RadiobuttonsCount = 0;

/* eslint-disable react/destructuring-assignment */
function RadiobuttonsFabric(props: {
	readonly buttons: IRadiobutton[];
	readonly tabIndex?: number;
	readonly ariaDescribedBy?: string;
	readonly disabled?: boolean;
	readonly readOnly?: boolean;
	readonly allowUnselect?: boolean;
	readonly value?:
	| string
	| {
		reference?: string;
		readonly isLocked: boolean;
		readonly isFrozen: boolean;
		readonly set: (value: TSerializeTypes, reference?: string, display?: string) => void;
	};
	readonly view?: 'live' | 'test' | 'preview';
	readonly onChange?: (value: string) => void;
	readonly onFocus?: (e: FocusEvent) => void;
	readonly onBlur?: (e: FocusEvent) => void;
	readonly onAutoFocus?: (el: HTMLInputElement | null) => void;
	readonly onSubmit?: () => void;
	readonly onCancel?: () => void;
}) {
	const valueRef = props.value;
	const debounceRef = useRef<number>(0);
	const [proxy, setProxy] = useState((typeof valueRef !== 'object' && valueRef) || '');
	const [value, setValue] = typeof valueRef === 'object'
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
	// eslint-disable-next-line no-plusplus
	const [name] = useState(() => SHA2.SHA2_256(`Radiobuttons${RadiobuttonsCount++}`));

	const changeValue = (val: string) => {
		setValue(val);

		if (props.onChange) {
			props.onChange(val);
		}
	};

	const disabled = props.disabled || props.readOnly || (typeof valueRef === 'object' && (valueRef.isFrozen || valueRef.isLocked)) || false;

	useEffect(() => () => {
		cancelUITimeout(debounceRef.current);
	}, []);

	return (
		<>
			{props.buttons.map(
				(button, index) => button.id
					&& (props.view === 'preview' || button.label || button.name || button.description) && (
					<div
						className="w-full"
						key={button.id || index}
					>
						<label
							className="relative inline-flex min-h-7 select-none pl-7"
						>
							<input
								className="absolute size-0 cursor-pointer opacity-0"
								// eslint-disable-next-line max-len
								ref={((value ? value === button.id : index === 0) && props.onAutoFocus) || undefined}
								type="radio"
								name={name}
								checked={value === button.id}
								tabIndex={button.tabIndex || props.tabIndex}
								aria-describedby={props.ariaDescribedBy}
								disabled={disabled}
								onChange={() => changeValue(button.id)}
								onClick={() => {
									if (props.allowUnselect && value === button.id) {
										changeValue('');
									}
								}}
								onFocus={props.onFocus}
								onBlur={props.onBlur}
								onKeyDown={(e) => {
									if (
										(props.allowUnselect || value !== button.id)
											&& (e.key === 'Enter' || e.key === ' ')
											&& !e.shiftKey
									) {
										e.preventDefault();

										changeValue(value === button.id ? '' : button.id);

										return;
									}

									if (e.key === 'Enter' && e.shiftKey && props.onSubmit) {
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
							<span>
								{button.label || button.name || '...'}
								{button.description && (
									<small>
										<br />
										{button.description}
									</small>
								)}
							</span>
							<span
								className={`absolute left-0 size-5 rounded-full border border-skin-primary bg-skin-secondary after:absolute after:left-[0.2rem] after:top-[0.2rem] after:size-3 after:rounded-full after:bg-skin-background after:transition-transform after:content-[''] dark:border-skin-primary-dark dark:bg-skin-secondary dark:after:bg-skin-background-dark ${value === button.id ? 'after:scale-100' : 'after:scale-0'} ${button.label ? 'top-[0.095rem]' : 'top-0'}`}
							/>
						</label>
					</div>
				),
			)}
		</>
	);
}

/* eslint-enable */

@tripetto({
	legacyBlock: true,
	type: 'node',
	identifier: '@tripetto/block-radiobuttons',
})
export default class RadiobuttonsBlock extends Radiobuttons implements IFormNodeBlock {
	render(props: IFormNodeBlockProps): ReactNode {
		return (
			<>
				{props.name}
				{props.description}
				<RadiobuttonsFabric
					buttons={this.buttons(props)}
					value={this.radioSlot}
					tabIndex={props.tabIndex}
					ariaDescribedBy={props.ariaDescribedBy}
					allowUnselect={false}
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
