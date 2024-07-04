import useTranslation from '@/lib/i18n/client';
import { useMangaContext } from '../context/MangaContext';
import { getLocalisedModalData, getModalDataRoot } from '../utils/types';
import ModalTabContent from './ModalTabContent';

export default function ModalTabLicenses() {
	const { manga, readerLanguage } = useMangaContext();
	const modalDataRoot = getModalDataRoot(manga);
	const modalData = getLocalisedModalData(modalDataRoot, readerLanguage);
	const { t } = useTranslation('reader', 'modal-licenses');
	return (
		<ModalTabContent>
			<h1 className="mb-4 text-3xl font-bold">{modalData.licensesGreeting}</h1>

			<h2 className="mb-2 text-2xl font-semibold underline">{t('artLicenses')}</h2>
			<p className="mb-4">
				{modalData.artLicensesContent}
				{' '}
				<a
					href="https://hololivepro.com/en/terms/"
					className="text-blue-500 underline"
					target="_blank"
				>
					{modalData.coverGuidelines}
				</a>
				.
			</p>
			{modalDataRoot.imageLicenses.map((image) => (
				<div className="mb-4" key={image.imageName}>
					<h3 className="text-lg font-semibold">{image.imageName}</h3>
					{image.licenseName && (
						<p>
							<strong>
								{t('license')}
								:
								{' '}
							</strong>
							<a
								href={image.licenseUrl}
								className="text-blue-500 underline"
								target="_blank"
							>
								{image.licenseName}
							</a>
						</p>
					)}
					{image.source && (
						<p>
							<a
								href={image.source}
								className="break-words text-blue-500 underline"
								target="_blank"
							>
								{t('source')}
							</a>
						</p>
					)}
					<strong>
						{t('usedOn')}
						:
						{' '}
					</strong>
					{' '}
					{image.usedLocation}
				</div>
			))}

			<h2 className="mb-2 text-2xl font-semibold underline">{t('fontLicenses')}</h2>
			{modalDataRoot.fontLicenses.map((font) => (
				<div className="mb-4" key={font.fontName}>
					<h3 className="text-lg font-semibold">{font.fontName}</h3>
					<p>
						<strong>
							{t('license')}
							:
						</strong>
						{' '}
						<a
							href={font.licenseUrl}
							className="text-blue-500 underline"
							target="_blank"
						>
							{font.licenseName}
						</a>
						<br />
						<strong>
							{t('source')}
							:
						</strong>
						{' '}
						{font.source}
					</p>
				</div>
			))}

			<h2 className="mb-2 text-2xl font-semibold underline">{t('additionalInfo')}</h2>
			<p>{modalData.additionalInfoContent}</p>
		</ModalTabContent>
	);
}
