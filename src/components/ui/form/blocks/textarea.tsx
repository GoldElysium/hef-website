import { ReactNode } from 'react';
import { tripetto } from '@tripetto/runner';
import { Textarea } from '@tripetto/block-textarea/runner';
import { TextareaFabric } from '@tripetto/runner-fabric/components/textarea';
import { IFormNodeBlock, IFormNodeBlockProps } from '@/components/ui/form/FormRunner';

@tripetto({
	legacyBlock: true,
	type: 'node',
	identifier: '@tripetto/block-textarea',
})
export default class TextareaBlock extends Textarea implements IFormNodeBlock {
	render(props: IFormNodeBlockProps): ReactNode {
		return (
			<>
				{props.name}
				{props.description}
				<TextareaFabric
					id={props.id}
					styles={{
						backgroundColor: 'inherit',
						borderColor: 'inherit',
						errorColor: 'red',
					}}
					value={this.textareaSlot}
					required={this.required}
					error={props.isFailed}
					autoSize
					tabIndex={props.tabIndex}
					placeholder={props.placeholder}
					maxLength={this.maxLength}
					ariaDescribedBy={props.ariaDescribedBy}
					onAutoFocus={props.autoFocus}
					onSubmit={props.onSubmit}
				/>
				{props.ariaDescription}
			</>
		);
	}
}
