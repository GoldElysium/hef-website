import TextHeader from '../TextHeader';
import DescriptionSerializer from '../DescriptionSerializer';

export default function Description({ description }: { description: any[] }) {
	return (
		<div>
			<TextHeader>Description</TextHeader>
			<div className="description-body">
				{DescriptionSerializer(description)}
			</div>
		</div>

	);
}
