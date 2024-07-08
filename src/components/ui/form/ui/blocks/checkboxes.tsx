import { ReactNode, FocusEvent } from 'react';
import { tripetto } from '@tripetto/runner';
import { Checkboxes } from '@tripetto/block-checkboxes/runner';
import { ICheckbox } from '@tripetto/runner-fabric/components/checkboxes';
import { IFormNodeBlock, IFormNodeBlockProps } from '@/components/ui/form/interfaces/block';
import { CheckboxFabric } from '@/components/ui/form/ui/blocks/checkbox';

/* eslint-disable react/destructuring-assignment */
function CheckboxesFabric(props: {
	readonly checkboxes: ICheckbox[];
	readonly tabIndex?: number;
	readonly ariaDescribedBy?: string;
	readonly view?: 'live' | 'test' | 'preview';
	readonly onFocus?: (e: FocusEvent) => void;
	readonly onBlur?: (e: FocusEvent) => void;
	readonly onAutoFocus?: (el: HTMLInputElement | null) => void;
	readonly onSubmit?: () => void;
	readonly onCancel?: () => void;
}) {
	return (
		<>
			{props.checkboxes.map(
				(checkbox, index) => (props.view === 'preview' || checkbox.label) && (
					<CheckboxFabric
						key={checkbox.id || index}
						label={checkbox.label}
						description={checkbox.description}
						required={checkbox.required}
						disabled={checkbox.disabled}
						readOnly={checkbox.readOnly}
						error={checkbox.error}
						tabIndex={checkbox.tabIndex || props.tabIndex}
						tabSubmit={index + 1 === props.checkboxes.length}
						value={checkbox.value}
						ariaDescribedBy={props.ariaDescribedBy}
						onChange={checkbox.onChange}
						onAutoFocus={(index === 0 && props.onAutoFocus) || undefined}
						onFocus={props.onFocus}
						onBlur={props.onBlur}
						onSubmit={props.onSubmit}
						onCancel={(index === 0 && props.onCancel) || undefined}
					/>
				),
			)}
		</>
	);
}
/* eslint-enable */

@tripetto({
	legacyBlock: true,
	type: 'node',
	identifier: '@tripetto/block-checkboxes',
})
export default class CheckboxesBlock extends Checkboxes implements IFormNodeBlock {
	render(props: IFormNodeBlockProps): ReactNode {
		return (
			<>
				{props.name}
				{props.description}
				<CheckboxesFabric
					checkboxes={this.checkboxes(props)}
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
