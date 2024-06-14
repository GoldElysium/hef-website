import useTranslation from '@/lib/i18n/client';
import CreditBlock from './CreditBlock';
import ModalTabContent from './ModalTabContent';
import { useMangaContext } from '../context/MangaContext';

export default function ModalTabGeneral() {
	const { manga } = useMangaContext();
	const { t } = useTranslation('reader', 'modal-general');

	return (
		<ModalTabContent>
			<h1 className="mb-4 text-4xl font-bold">{t('greeting')}</h1>
			<p className="mb-4">{t('essay')}</p>
			<h2 className="mb-4 text-3xl font-bold underline">
				{t('credits')}
			</h2>
			<div className="grid w-full lg:grid-cols-2 lg:grid-rows-2">
				<CreditBlock label="authors" contributors={manga.authors} />
				<CreditBlock label="artists" contributors={manga.artists} />
				<CreditBlock
					label="translators"
					contributors={manga.translators}
				/>
				<CreditBlock label="programmers" contributors={manga.devs} />
			</div>
		</ModalTabContent>
	);
}
