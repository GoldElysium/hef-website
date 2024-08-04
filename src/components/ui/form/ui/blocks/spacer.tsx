import { tripetto } from '@tripetto/runner';
import { Spacer } from '@holoenfans/tripetto-block-spacer/runner';
import { IFormNodeBlock } from '@/components/ui/form/interfaces/block';

@tripetto({
	type: 'node',
	identifier: '@holoenfans/tripetto-block-spacer',
})
export default class SpacerBlock extends Spacer implements IFormNodeBlock {
	render() {
		return (
			<hr style={{ height: `${this.size}em` }} className="min-w-1 border-none" />
		);
	}
}
