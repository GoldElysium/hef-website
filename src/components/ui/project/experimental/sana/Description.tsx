import TextHeader from '@/components/ui/project/experimental/sana/TextHeader';
import {
	PayloadLexicalReactRenderer,
	PayloadLexicalReactRendererContent,
} from '@atelier-disko/payload-lexical-react-renderer';

export default function Description({ description }: { description: any }) {
	return (
		<div>
			<TextHeader>Description</TextHeader>
			<div className="description-body">
				<PayloadLexicalReactRenderer
					content={description as PayloadLexicalReactRendererContent}
				/>
			</div>
		</div>

	);
}
