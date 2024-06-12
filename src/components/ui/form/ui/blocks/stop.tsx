import { ReactNode } from 'react';
import { tripetto } from '@tripetto/runner';
import { Stop } from '@tripetto/block-stop/runner';
import { IFormNodeBlock, IFormNodeBlockProps } from '@/components/ui/form/interfaces/block';

@tripetto({
	legacyBlock: true,
	type: 'node',
	identifier: '@tripetto/block-stop',
})
export default class StopBlock extends Stop implements IFormNodeBlock {
	readonly marginAroundBlock = true;

	render(props: IFormNodeBlockProps): ReactNode {
		return (
			(props.name || props.description || this.props.imageURL) && (
				<>
					{this.props.imageURL && this.props.imageAboveText && (
						<img
							src={props.markdownifyToImage(this.props.imageURL)}
							width={this.props.imageWidth}
							alt=""
						/>
					)}
					{props.name && <h2 className="text-xl">{props.name}</h2>}
					{props.description}
					{this.props.imageURL && !this.props.imageAboveText && (
						<img
							src={props.markdownifyToImage(this.props.imageURL)}
							width={this.props.imageWidth}
							alt=""
						/>
					)}
				</>
			)
		);
	}
}
