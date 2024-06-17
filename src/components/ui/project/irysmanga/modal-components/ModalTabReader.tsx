import useTranslation from '@/lib/i18n/client';
import ModalTabContent from './ModalTabContent';

export default function MangaReaderModal() {
	const { t } = useTranslation('reader', 'modal-reader');

	return (
		<ModalTabContent>
			<h1 className="mb-4 text-3xl font-bold">{t('greeting')}</h1>
			<p className="mb-4">{t('introduction')}</p>
			<h2 className="mb-2 text-2xl font-semibold">{t('howto')}</h2>
			<ul className="mb-4 list-inside list-disc">
				<li>
					<span className="font-semibold">{t('page-turn')}</span>
					{' '}
					{t('page-turn-text')}
				</li>
				<li>
					<span className="font-semibold">{t('settings')}</span>
					{' '}
					{t('settings-text')}
				</li>
				<li>
					<span className="font-semibold">{t('space')}</span>
					{' '}
					{t('space-text')}
				</li>
			</ul>
			<h2 className="mb-2 text-2xl font-semibold">{t('shortcut')}</h2>
			<ul className="kb-list grid list-inside list-disc min-[1260px]:grid-cols-2">
				<li>
					<kbd className="kbdalt">→</kbd>
					<kbd className="kbdalt">←</kbd>

					<span>{t('page-turn-k')}</span>
				</li>
				<li>
					<kbd className="kbdalt">↑</kbd>
					<kbd className="kbdalt">↓</kbd>
					<span>{t('page-scroll-k')}</span>
				</li>
				<li>
					<kbd className="kbdalt">,</kbd>
					<kbd className="kbdalt">.</kbd>
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
					<kbd className="kbdalt">D</kbd>
					<span>{t('page-direction-k')}</span>
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
