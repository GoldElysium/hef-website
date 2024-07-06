import useTranslation from '@/lib/i18n/client';
import { useMangaContext } from '../context/MangaContext';
import { getLocalisedModalData, getModalDataRoot } from '../utils/types';
import ModalTabContent from './ModalTabContent';

export default function ModalTabLicenses() {
	const { manga, readerLanguage } = useMangaContext();
	const modalDataRoot = getModalDataRoot(manga);
	const modalData = getLocalisedModalData(modalDataRoot, readerLanguage);
	const { t } = useTranslation('reader', 'modal-licenses');

	const coverGuidelinesParts = modalData.artLicensesContent.split(modalData.coverGuidelines);
	const additionalInfoParts = modalData.additionalInfoContent.split(modalData.contactInfo);
	return (
		<ModalTabContent>
			<h1 className="mb-4 text-3xl font-bold">{modalData.licensesGreeting}</h1>

			<h2 className="mb-2 text-2xl font-semibold underline">{t('artLicenses')}</h2>
			<p className="mb-4">
				{coverGuidelinesParts[0]}
				{' '}
				<a
					href={modalData.coverGuidelinesUrl}
					className="text-blue-500 underline"
					target="_blank"
				>
					{modalData.coverGuidelines}
				</a>
				{' '}
				{coverGuidelinesParts.length > 1 ? coverGuidelinesParts[1] : '.'}
			</p>

			{modalDataRoot.imageLicenses.map((image) => (
				<div className="mb-4" key={image.imageName[readerLanguage]}>
					<h3 className="text-lg">{image.imageName[readerLanguage]}</h3>
					{(image.licenseName && image.licenseUrl) && (
						<p>
							<span>
								{t('license')}
								:
								{' '}
							</span>
							<a
								href={image.licenseUrl[readerLanguage]}
								className="text-blue-500 underline"
								target="_blank"
							>
								{image.licenseName[readerLanguage]}
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
					<span>
						{t('usedOn')}
						:
						{' '}
					</span>
					{' '}
					{image.usedLocation}
				</div>
			))}

			<h2 className="mb-2 text-2xl font-semibold underline">{t('fontLicenses')}</h2>
			{modalDataRoot.fontLicenses.map((font) => (
				<div className="mb-4" key={font.fontName}>
					<h3 className="text-lg">{font.fontName}</h3>
					<p>
						<span>
							{t('license')}
							:
						</span>
						{' '}
						<a
							href={font.licenseUrl}
							className="text-blue-500 underline"
							target="_blank"
						>
							{font.licenseName}
						</a>
						<br />
						<span>
							{t('source')}
							:
						</span>
						{' '}
						{font.source}
					</p>
				</div>
			))}

			<h2 className="mb-2 text-2xl font-semibold underline">{t('additionalInfo')}</h2>
			<p>
				{additionalInfoParts[0]}
				{' '}
				<a
					className="inline text-blue-500 underline"
					href={`mailto:${modalData.contactInfo}`}
				>
					{modalData.contactInfo}
				</a>
				{' '}
				{additionalInfoParts.length > 1 ? additionalInfoParts[1] : '.'}
			</p>
		</ModalTabContent>
	);
}
