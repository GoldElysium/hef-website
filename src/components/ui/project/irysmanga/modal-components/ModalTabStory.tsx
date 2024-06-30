import useTranslation from '@/lib/i18n/client';
import Image from 'next/image';
import ModalTabContent from './ModalTabContent';

export default function ModalTabStory() {
	const { t } = useTranslation('reader', 'modal-story');

	return (
		<ModalTabContent>
			<h1 className="mb-4 text-4xl font-bold">{t('greeting')}</h1>
			<p className="mb-4">{t('content')}</p>
			<figure>
				<Image
					src="/assets/irysmanga/other/backroom.png"
					alt="backroom image"
					width={1919}
					height={1079}
					className="rounded-lg"
				/>
				<figcaption className="text-center">
					Good and Bad GuyRys last seen in the Backrooms
				</figcaption>
			</figure>
		</ModalTabContent>
	);
}
