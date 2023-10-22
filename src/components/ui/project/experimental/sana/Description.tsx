import TextHeader from '@/components/ui/project/experimental/sana/TextHeader';
import DescriptionSerializer from '@/components/ui/project/util/DescriptionSerializer';

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
