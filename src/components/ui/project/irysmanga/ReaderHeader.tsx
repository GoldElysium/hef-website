import useTranslation from '@/lib/i18n/client';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import classNames from 'classnames';
import { Bars3Icon } from '@heroicons/react/24/solid';
import Icon from '@/components/ui/Icon';
import { useMangaContext } from './context/MangaContext';
import { getMangaDataOrThrow } from './utils/types';
import './styles/styles.css';
import styles from './styles/Header.module.css';

interface Props {
	openSidebar: boolean;
	setOpenSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ReaderHeader({ openSidebar, setOpenSidebar }: Props) {
	const {
		page, chapter, manga, mangaLanguage, headerVisibility,
	} = useMangaContext();
	const containerRef = useRef<HTMLDivElement>(null);
	const { t } = useTranslation('reader');

	useEffect(() => {
		const height = containerRef.current?.getBoundingClientRect().height;
		document.documentElement.style.setProperty('--header-height', `${height!}px`);
	}, []);
	const mangaData = getMangaDataOrThrow(manga, mangaLanguage);
	const currentChapter = mangaData.chapters[chapter];
	return (
		<>
			<div
				className={classNames(styles.fakeHeader, {
					[styles.fakeHeaderShown]: headerVisibility === 'header-shown',
					[styles.fakeHeaderHidden]: headerVisibility === 'header-hidden',
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
					<Link href="/" tabIndex={headerVisibility === 'header-shown' ? 0 : -1}>
						<Icon />
					</Link>
					<div className={styles.infoBadge}>
						<strong className="">{mangaData.title}</strong>
					</div>
				</div>
				<div className="flex items-center gap-2">
					<div className={styles.infoBadge}>
						<span className={styles.infoBadgeTitle}>{t('chapter')}</span>
						<span className={styles.infoBadgeContent}>
							{`${chapter + 1} / ${mangaData.chapterCount}`}
						</span>
					</div>
					<div className={styles.infoBadge}>
						<span className={styles.infoBadgeTitle}>{t('page')}</span>
						<span className={styles.infoBadgeContent}>
							{`${page + 1} / ${currentChapter.pageCount}`}
						</span>
					</div>
					<button
						type="button"
						aria-label="Open the sidebar"
						onClick={() => setOpenSidebar((curr) => !curr)}
						disabled={openSidebar || headerVisibility === 'header-hidden'}
					>
						<Bars3Icon
							className={classNames(
								'transition-all cursor-pointer hover:opacity-100 z-10',
								{
									'opacity-0': openSidebar,
									'opacity-60': !openSidebar,
								},
							)}
							width={openSidebar ? 0 : 30}
						/>
					</button>
				</div>
			</div>
		</>
	);
}
