import useTranslation from '@/lib/i18n/client';
import { SparklesIcon } from '@heroicons/react/24/outline';
import { useTheme } from 'next-themes';
import CreditBlock from './CreditBlock';
import ModalTabContent from './ModalTabContent';
import { useMangaContext } from '../context/MangaContext';
import FloatingDecoArt from './FloatingDecoArt';

const bgDecoSrc: { [key: string]: string } = {
	dark: '/assets/irysmanga/chibi/keychainrys.png',
	light: '/assets/irysmanga/chibi/iryshood.png',
};

export default function ModalTabGeneral() {
	const { manga } = useMangaContext();
	const { t } = useTranslation('reader', 'modal-general');
	const { resolvedTheme } = useTheme();

	return (
		<ModalTabContent>
			<h1 className="mb-4 flex items-center gap-1 text-4xl font-bold">
				{t('greeting')}
				{' '}
				<SparklesIcon width="2.5rem" />
			</h1>
			<p className="mb-4">{t('essay')}</p>
			<h2 className="mb-4 text-3xl font-bold underline">{t('credits')}</h2>
			<div className="grid w-full lg:grid-rows-2 min-[1260px]:grid-cols-2">
				<CreditBlock
					label="organizers"
					contributors={manga.contributors.filter((e) => e.role === 'organizer')}
				/>
				<CreditBlock
					label="authors"
					contributors={manga.contributors.filter((e) => e.role === 'writer')}
				/>
				<CreditBlock
					label="lead-artists"
					contributors={manga.contributors.filter((e) => e.role === 'lead-artist')}
				/>
				<CreditBlock
					label="artists"
					contributors={manga.contributors.filter((e) => e.role === 'artist')}
				/>
				<CreditBlock
					label="translators"
					contributors={manga.contributors.filter((e) => e.role === 'translator')}
				/>
				<CreditBlock
					label="programmers"
					contributors={manga.contributors.filter((e) => e.role === 'developer')}
				/>
			</div>
			<FloatingDecoArt
				src={bgDecoSrc[resolvedTheme as string]}
				className="absolute left-[70%] top-[50%] opacity-50"
				width="200"
			/>
		</ModalTabContent>
	);
}
