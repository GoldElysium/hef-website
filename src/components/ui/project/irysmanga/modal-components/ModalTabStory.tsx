import useTranslation from '@/lib/i18n/client';
import ModalTabContent from './ModalTabContent';

export default function ModalTabStory() {
	const { t } = useTranslation('reader', 'modal-story');

	return (
		<ModalTabContent>
			<h1 className="mb-4 text-4xl font-bold">{t('greeting')}</h1>
			<p className="mb-4">{t('content')}</p>
		</ModalTabContent>
	);
}
