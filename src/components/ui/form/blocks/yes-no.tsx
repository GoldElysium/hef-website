import { ReactNode } from 'react';
import { tripetto } from '@tripetto/runner';
import { YesNo } from '@tripetto/block-yes-no/runner';
import { YesNoFabric } from '@tripetto/runner-fabric/components/yes-no';
import { IFormNodeBlockProps, IFormNodeBlock } from '@/components/ui/form/FormRunner';

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
					styles={{
						yesColor: 'green',
						noColor: 'red',
					}}
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
