import Image from 'next/image';
import ModalTabContent from './ModalTabContent';
import { useMangaContext } from '../context/MangaContext';
import { getLocalisedModalData, getModalDataRoot } from '../utils/types';

export default function ModalTabStory() {
	const { manga, readerLanguage } = useMangaContext();
	const modalData = getLocalisedModalData(getModalDataRoot(manga), readerLanguage);

	return (
		<ModalTabContent>
			<h1 className="mb-4 text-4xl font-bold">{modalData.storyGreeting}</h1>
			<p className="mb-4 whitespace-pre-line">{modalData.storyContent}</p>
			<figure>
				<Image
					src={modalData.storyImage}
					alt="backroom image"
					width={1919}
					height={1079}
					className="rounded-lg"
				/>
				<figcaption className="mt-2 text-center text-sm">
					{modalData.storyImageCaption}
				</figcaption>
			</figure>
		</ModalTabContent>
	);
}
