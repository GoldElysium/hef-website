import useTranslation from '@/lib/i18n/client';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import classNames from 'classnames';
import { Bars3Icon } from '@heroicons/react/24/solid';
import Icon from '@/components/ui/Icon';
import { useMangaContext } from './context/MangaContext';
import { Chapter, getMangaDataOrThrow } from './utils/types';
import './styles/styles.css';
import styles from './styles/Header.module.css';

interface Props {
	openSidebar: boolean;
	setOpenSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ReaderHeader({ openSidebar, setOpenSidebar }: Props) {
	const {
		chapter, manga, mangaLanguage, headerVisibility,
	} = useMangaContext();
	const containerRef = useRef<HTMLDivElement>(null);
	const { t } = useTranslation('reader');

	useEffect(() => {
		const height = containerRef.current?.getBoundingClientRect().height;
		document.documentElement.style.setProperty('--header-height', `${height!}px`);
	}, []);
	const mangaData = getMangaDataOrThrow(manga, mangaLanguage);

	function generateChapterLabel(currentChapter: Chapter) {
		if (currentChapter.isCover) {
			return t('cover');
		}

		if (currentChapter.isBackCover) {
			return t('back-cover');
		}

		return `${t('chapter')} ${currentChapter.displayChapterNumber}`;
	}

	const currentChapter = mangaData.chapters[chapter];
	const chapterLabel = generateChapterLabel(currentChapter);
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
					<div className="flex flex-col">
						<div className={styles.infoTitle}>
							<strong className="">{mangaData.title}</strong>
						</div>
						<div className={styles.infoBadge}>
							<span className={styles.infoBadgeContent}>
								{chapterLabel}
							</span>
						</div>
					</div>
				</div>
				<div className="flex grow items-center justify-end gap-2 md:gap-4">
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
