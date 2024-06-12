import { ReactNode } from 'react';
import { tripetto } from '@tripetto/runner';
import { Error } from '@tripetto/block-error/runner';
import { IFormNodeBlock, IFormNodeBlockProps } from '@/components/ui/form/interfaces/block';

@tripetto({
	legacyBlock: true,
	type: 'node',
	identifier: '@tripetto/block-error',
})
export default class ErrorBlock extends Error implements IFormNodeBlock {
	readonly marginAroundBlock = true;

	render(props: IFormNodeBlockProps): ReactNode {
		return (
			(props.name || props.description) && (
				<div className="text-skin-primary dark:text-skin-heading-dark">
					{props.name && <h2 className="text-xl font-bold">{props.name}</h2>}
					{props.description}
				</div>
			)
		);
	}
}
