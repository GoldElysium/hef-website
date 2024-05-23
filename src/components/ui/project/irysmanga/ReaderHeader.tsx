import { useEffect, useRef, useState } from 'react';
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
	const containerRef = useRef<HTMLDivElement>(null);
	const [containerHeight, setContainerHeight] = useState(0);

	const topBarClasses = classNames(
		'flex w-full min-h-[64px] bg-base-100 shrink-0 justify-between items-center p-4 absolute z-10 transition-drawer ease-in-out duration-[150ms]',
		{
			'translate-y-0 opacity-100': headerVisibility === 'shown',
			'-translate-y-full opacity-0': headerVisibility === 'hidden',
		},
	);

	useEffect(() => {
		if (headerVisibility === 'shown') {
			const height = containerRef.current?.getBoundingClientRect().height;
			setContainerHeight(height!);
		} else {
			setContainerHeight(0);
		}
	}, [headerVisibility]);

	const fakeContainer = classNames(
		'shrink-0 transition-drawer ease-in-out duration-[150ms] bg-transparent',
	);

	const mangaData = getMangaDataOrThrow(manga, language);
	const currentChapter = mangaData.chapters[chapter];
	return (
		<>
			{/* eslint-disable */}
            <div
                id="fakeTopbar"
                className={fakeContainer}
                style={{ height: `${containerHeight}px` }}
            ></div>
            <div className={topBarClasses} ref={containerRef}>
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
