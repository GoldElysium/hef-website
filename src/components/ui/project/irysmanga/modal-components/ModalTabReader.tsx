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
			<ul className="grid list-inside list-disc grid-cols-1 min-[920px]:grid-cols-2 min-[1360px]:grid-cols-3">
				<li>
					{t('page-turn-k')}
					{' '}
					<kbd className="kbdalt">→</kbd>
					{' '}
					{t('or')}
					{' '}
					<kbd className="kbdalt">←</kbd>
				</li>
				<li>
					{t('page-scroll-k')}
					{' '}
					<kbd className="kbdalt">↑</kbd>
					{' '}
					{t('or')}
					{' '}
					<kbd className="kbdalt">↓</kbd>
				</li>
				<li>
					{t('chapter-turn-k')}
					{' '}
					<kbd className="kbdalt">,</kbd>
					{' '}
					{t('or')}
					{' '}
					<kbd className="kbdalt">.</kbd>
				</li>
				<li>
					{t('manga-language-k')}
					{' '}
					<kbd className="kbdalt">J</kbd>
				</li>
				<li>
					{t('reader-language-k')}
					{' '}
					<kbd className="kbdalt">K</kbd>
				</li>
				<li>
					{t('page-direction-k')}
					{' '}
					<kbd className="kbdalt">D</kbd>
				</li>
				<li>
					{t('sidebar-k')}
					{' '}
					<kbd className="kbdalt">M</kbd>
				</li>
				<li>
					{t('header-k')}
					{' '}
					<kbd className="kbdalt">H</kbd>
				</li>
				<li>
					{t('theme-k')}
					{' '}
					<kbd className="kbdalt">T</kbd>
				</li>
				<li>
					{t('page-layout-k')}
					{' '}
					<kbd className="kbdalt">S</kbd>
				</li>
				<li>
					{t('page-fit-k')}
					{' '}
					<kbd className="kbdalt">F</kbd>
				</li>
				<li>
					{t('progress-k')}
					{' '}
					<kbd className="kbdalt">P</kbd>
				</li>
			</ul>
		</ModalTabContent>
	);
}
