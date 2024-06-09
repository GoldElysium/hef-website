import Link from 'next/link';
import { useEffect, useRef } from 'react';
import classNames from 'classnames';
import { Bars3Icon } from '@heroicons/react/24/solid';
import { useMangaContext } from './context/MangaContext';
import { getMangaDataOrThrow } from './utils/types';
import './styles/styles.css';
import styles from './styles/Header.module.css';
import NavIcon from './NavIcon';
import useDualTranslation from './hooks/useDualTranslation';

interface Props {
	setOpenSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}

function ReaderHeader({ setOpenSidebar }: Props) {
	const {
		page, chapter, manga, mangaLanguage, headerVisibility,
	} = useMangaContext();
	const tManga = useDualTranslation(mangaLanguage);
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const height = containerRef.current?.getBoundingClientRect().height;
		document.documentElement.style.setProperty(
			'--header-height',
			`${height!}px`,
		);
	}, []);
	const mangaData = getMangaDataOrThrow(manga, mangaLanguage);
	const currentChapter = mangaData.chapters[chapter];
	return (
		<>
			<div
				className={classNames(styles.fakeHeader, {
					[styles.fakeHeaderShown]:
						headerVisibility === 'header-shown',
					[styles.fakeHeaderHidden]:
						headerVisibility === 'header-hidden',
				})}
			/>
			<div
				className={classNames(styles.header, {
					[styles.headerShown]: headerVisibility === 'header-shown',
					[styles.headerHidden]: headerVisibility === 'header-hidden',
				})}
				ref={containerRef}
			>
				<div className="flex items-center gap-2">
					<Link href="/">
						<NavIcon />
					</Link>
					<div className={styles.infoBadge}>
						<strong className="">{mangaData.title}</strong>
						{/* <strong className={styles.infoBadgeContent}>
                            {currentChapter.title}
                        </strong> */}
					</div>
				</div>
				<div className="flex items-center gap-2">
					<div className={styles.infoBadge}>
						<span className={styles.infoBadgeTitle}>
							{tManga('chapter')}
						</span>
						<span className={styles.infoBadgeContent}>
							{`${chapter + 1} / ${mangaData.chapterCount}`}
						</span>
					</div>
					<div className={styles.infoBadge}>
						<span className={styles.infoBadgeTitle}>
							{tManga('page')}
						</span>
						<span className={styles.infoBadgeContent}>
							{`${page + 1} / ${currentChapter.pageCount}`}
						</span>
					</div>
					<Bars3Icon
						className="barIcon z-10"
						onClick={() => setOpenSidebar((curr) => !curr)}
						width={30}
					/>
				</div>
			</div>
		</>
	);
}

export default ReaderHeader;
