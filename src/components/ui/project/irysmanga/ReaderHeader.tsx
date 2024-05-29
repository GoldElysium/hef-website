import Link from 'next/link';
import { useEffect, useRef } from 'react';
import useTranslation from '@/lib/i18n/client';
import classNames from 'classnames';
import { useMangaContext } from './context/MangaContext';
import { getMangaDataOrThrow } from './utils/types';
import './styles/styles.css';
import styles from './styles/Header.module.css';
import NavIcon from './NavIcon';

interface Props {
	setOpenSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}

function ReaderHeader({ setOpenSidebar }: Props) {
	const {
		page, chapter, manga, language, headerVisibility,
	} = useMangaContext();
	const { t } = useTranslation('reader');
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const height = containerRef.current?.getBoundingClientRect().height;
		document.documentElement.style.setProperty(
			'--header-height',
			`${height!}px`,
		);
	}, []);
	const mangaData = getMangaDataOrThrow(manga, language);
	const currentChapter = mangaData.chapters[chapter];
	return (
		<>
			{/* eslint-disable */}
            <div
                className={classNames(styles.fakeHeader, {
                    [styles.fakeHeaderShown]:
                        headerVisibility === "header-shown",
                    [styles.fakeHeaderHidden]:
                        headerVisibility === "header-hidden",
                })}
            ></div>
            <div
                className={classNames(styles.header, {
                    [styles.headerShown]: headerVisibility === "header-shown",
                    [styles.headerHidden]: headerVisibility === "header-hidden",
                })}
                ref={containerRef}
            >
                <div className="flex gap-2 items-center">
                    <Link href={"/"}>
                        <NavIcon></NavIcon>
                    </Link>
                    <div className={styles.infoBadge}>
                        <strong className={""}>{mangaData.title}</strong>
                        {/* <strong className={styles.infoBadgeContent}>
                            {currentChapter.title}
                        </strong> */}
                    </div>
                </div>
                <div className="flex gap-2 items-center">
                    <div className={styles.infoBadge}>
                        <span className={styles.infoBadgeTitle}>
                            {t("chapter")}
                        </span>
                        <span className={styles.infoBadgeContent}>
                            {chapter + 1} / {mangaData.chapterCount}
                        </span>
                    </div>
                    <div className={styles.infoBadge}>
                        <span className={styles.infoBadgeTitle}>
                            {t("page")}
                        </span>
                        <span className={styles.infoBadgeContent}>
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
