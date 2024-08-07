import useTranslation from '@/lib/i18n/client';
import ModalTabContent from './ModalTabContent';
import { useMangaContext } from '../context/MangaContext';
import { getLocalisedModalData, getModalDataRoot } from '../utils/types';

export default function MangaReaderModal() {
	const { t } = useTranslation('reader', 'modal-reader');
	const { manga, readerLanguage } = useMangaContext();
	const modalData = getLocalisedModalData(getModalDataRoot(manga), readerLanguage);

	return (
		<ModalTabContent>
			<h1 className="mb-4 text-3xl font-bold">{modalData.readerGreeting}</h1>
			<p className="mb-4 whitespace-pre-line">{modalData.readerIntro}</p>
			<h2 className="mb-2 text-2xl font-semibold">{t('howto')}</h2>
			<ul className="disc-list mb-4 list-inside list-disc">
				<li>
					<span className="font-bold">{t('page-turn')}</span>
					<p>{t('page-turn-text')}</p>
				</li>
				<li>
					<span className="font-bold">{t('settings')}</span>
					<p>{t('settings-text')}</p>
				</li>
				<li>
					<span className="font-bold">{t('space')}</span>
					<p>{t('space-text')}</p>
				</li>
			</ul>
			<h2 className="mb-2 text-2xl font-semibold">{t('shortcut')}</h2>
			<ul className="kb-list grid list-inside list-disc min-[1260px]:grid-cols-2">
				<li>
					<kbd className="kbdalt">←</kbd>
					<kbd className="kbdalt ml-1">→</kbd>
					<span>{t('page-turn-k')}</span>
				</li>
				<li>
					<kbd className="kbdalt">↑</kbd>
					<kbd className="kbdalt ml-1">↓</kbd>
					<span>{t('page-scroll-k')}</span>
				</li>
				<li>
					<kbd className="kbdalt">,</kbd>
					<kbd className="kbdalt ml-1">.</kbd>
					<span>{t('chapter-turn-k')}</span>
				</li>
				<li>
					<kbd className="kbdalt">J</kbd>
					<span>{t('manga-language-k')}</span>
				</li>
				<li>
					<kbd className="kbdalt">K</kbd>
					<span>{t('reader-language-k')}</span>
				</li>
				<li>
					<kbd className="kbdalt">M</kbd>
					<span>{t('sidebar-k')}</span>
				</li>
				<li>
					<kbd className="kbdalt">H</kbd>
					<span>{t('header-k')}</span>
				</li>
				<li>
					<kbd className="kbdalt">T</kbd>
					<span>{t('theme-k')}</span>
				</li>
				<li>
					<kbd className="kbdalt">S</kbd>
					<span>{t('page-layout-k')}</span>
				</li>
				<li>
					<kbd className="kbdalt">F</kbd>
					<span>{t('page-fit-k')}</span>
				</li>
				<li>
					<kbd className="kbdalt">P</kbd>
					<span>{t('progress-k')}</span>
				</li>
			</ul>
		</ModalTabContent>
	);
}
