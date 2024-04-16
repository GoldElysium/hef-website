import { ReactNode } from 'react';
import { tripetto } from '@tripetto/runner';
import { Text } from '@tripetto/block-text/runner';
import { IFormNodeBlockProps, IFormNodeBlock } from '@/components/ui/form/FormRunner';
import Input from '@/components/ui/form/blocks/input';

@tripetto({
	legacyBlock: true,
	type: 'node',
	identifier: '@tripetto/block-text',
})
export default class TextBlock extends Text implements IFormNodeBlock {
	render(props: IFormNodeBlockProps): ReactNode {
		return (
			<>
				{props.name}
				{props.description}
				<Input
					id={props.id}
					list={this.suggestions && props.id}
					value={this.textSlot}
					required={this.required}
					error={props.isFailed}
					tabIndex={props.tabIndex}
					placeholder={props.placeholder}
					maxLength={this.maxLength}
					autoComplete={this.autoComplete}
					type={this.autoComplete === 'tel' ? 'tel' : 'text'}
					ariaDescribedBy={props.ariaDescribedBy}
					onAutoFocus={props.autoFocus}
					onSubmit={props.onSubmit}
				/>
				{this.suggestions && (
					<datalist id={props.id}>
						{/* eslint-disable-next-line max-len */}
						{/* eslint-disable-next-line react/no-array-index-key,jsx-a11y/control-has-associated-label */}
						{this.suggestions.map((suggestion, index) => suggestion && <option key={`${props.id}-${index}`} value={suggestion} />)}
					</datalist>
				)}
				{props.ariaDescription}
			</>
		);
	}
}
