import useTranslation from '@/lib/i18n/client';
import classNames from 'classnames';
import { useMangaContext } from './context/MangaContext';
import { getMangaDataOrThrow } from './utils/types';
import './styles/styles.css';

interface Props {
	setOpenSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}

function ReaderHeader({ setOpenSidebar }: Props) {
	const {
		page, chapter, manga, language, headerVisibility,
	} = useMangaContext();
	const { t } = useTranslation('reader');

	const topBarClasses = classNames(
		'flex w-full justify-between items-center p-4 border-b-1',
		{
			'': headerVisibility === 'shown',
			'max-h-[0px] hidden': headerVisibility === 'hidden',
		},
	);

	const mangaData = getMangaDataOrThrow(manga, language);
	const currentChapter = mangaData.chapters[chapter];
	return (
		<>
			{/* eslint-disable */}
            <div className={topBarClasses}>
                <div className="flex gap-2 items-center manga-title-container">
                    <div className="info-badge">
                        <strong className="info-badge-title">
                            {mangaData.title}
                        </strong>
                        <strong className="info-badge-content">
                            {currentChapter.title}
                        </strong>
                    </div>
                </div>
                <div className="flex gap-2 items-center">
                    <div className={"info-badge"}>
                        <span className="info-badge-title">{t("chapter")}</span>
                        <span className="info-badge-content">
                            {chapter + 1} / {mangaData.chapterCount}
                        </span>
                    </div>
                    <div className={"info-badge"}>
                        <span className="info-badge-title">{t("page")}</span>
                        <span className="info-badge-content">
                            {page + 1} / {currentChapter.pageCount}
                        </span>
                    </div>
                    <button
                        className={"btn btn-sm btn-neutral"}
                        onClick={() => setOpenSidebar((prev) => !prev)}
                    >
                        {t("menu")}
                    </button>
                </div>
            </div>
            {/* eslint-enable */}
		</>
	);
}

export default ReaderHeader;
