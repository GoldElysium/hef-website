import TextHeader from 'ui/project/experimental/TextHeader';
import DescriptionSerializer from 'ui/project/DescriptionSerializer';

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
