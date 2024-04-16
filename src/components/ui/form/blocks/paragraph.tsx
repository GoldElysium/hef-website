import type { IFormNodeBlock, IFormNodeBlockProps } from '@/components/ui/form/FormRunner';
import { Paragraph } from '@tripetto/block-paragraph/runner';
import { tripetto } from '@tripetto/runner';
import { ReactNode } from 'react';
import ReactPlayer from 'react-player';

@tripetto({
	legacyBlock: true,
	type: 'node',
	identifier: '@tripetto/block-paragraph',
	alias: 'paragraph',
})
export default class ParagraphBlock extends Paragraph implements IFormNodeBlock {
	render(props: IFormNodeBlockProps): ReactNode {
		return (
			<>
				{this.props.imageURL && this.props.imageAboveText && (
					<img src={props.markdownifyToImage(this.props.imageURL)} width={this.props.imageWidth} alt="" />
				)}
				{props.name && <h3>{props.name}</h3>}
				{this.props.caption && <span>{props.markdownifyToJSX(this.props.caption)}</span>}
				{props.description}
				{this.props.imageURL && !this.props.imageAboveText && (
					<img src={props.markdownifyToImage(this.props.imageURL)} width={this.props.imageWidth} alt="" />
				)}
				{this.props.video && <ReactPlayer src={props.markdownifyToURL(this.props.video)} />}
				{props.ariaDescription}
			</>
		);
	}
}
