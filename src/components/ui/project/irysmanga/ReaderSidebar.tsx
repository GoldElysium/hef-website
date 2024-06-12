import classNames from 'classnames';
import { XMarkIcon } from '@heroicons/react/24/solid';
import {
	BookOpenIcon,
	DocumentIcon,
	InformationCircleIcon,
} from '@heroicons/react/24/outline';
import { useEffect, useRef } from 'react';
import useTranslation from '@/lib/i18n/client';
import SelectBox from './SelectBox';
import { useMangaContext } from './context/MangaContext';
import {
	directions,
	fitModes,
	getMangaDataOrThrow,
	headerVisibilities,
	languages,
	pageLayouts,
	progressVisibilities,
	ReaderSetting,
	readerThemes,
} from './utils/types';
import SettingButton from './SettingButton';
import styles from './styles/Sidebar.module.css';
import ReaderModal from './modal-components/ReaderModal';

interface Props {
	openSidebar: boolean;
	setOpenSidebar: React.Dispatch<React.SetStateAction<boolean>>;
	modalRef: React.RefObject<HTMLDialogElement>;
}

function ReaderSidebar({ openSidebar, setOpenSidebar, modalRef }: Props) {
	const {
		pageLayout,
		page,
		chapter,
		fitMode,
		readerLanguage,
		mangaLanguage,
		direction,
		headerVisibility,
		progressVisibility,
		readerTheme,
		manga,
		setPageLayout,
		setFitMode,
		setReaderLanguage,
		setMangaLanguage,
		setDirection,
		setHeaderVisibility,
		setProgressVisibility,
		setReaderTheme,
	} = useMangaContext();
	const { t, i18n } = useTranslation('reader');
	useEffect(() => {
		i18n.changeLanguage(readerLanguage);
	}, [readerLanguage, i18n]);
	const mangaData = getMangaDataOrThrow(manga, mangaLanguage);
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const width = containerRef.current?.getBoundingClientRect().width;
		document.documentElement.style.setProperty(
			'--sidebar-width',
			`${width!}px`,
		);

		const handleClickOutside = (event: MouseEvent) => {
			if (window.innerWidth > 768) {
				return;
			}
			if (
				containerRef.current
                && !containerRef.current.contains(event.target as Node)
                && !modalRef.current?.open
			) {
				setOpenSidebar(false);
			}
		};

		// Set your threshold here (e.g., 768 for small screens)
		document.addEventListener('mousedown', handleClickOutside);

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [setOpenSidebar, modalRef]);

	const mangaLanguages: ReaderSetting[] = [];

	languages.forEach((value) => {
		// If no chapters don't allow it as a selectable target.
		if (manga.data[value].chapterCount === 0) {
			return;
		}

		if (manga.data[value].chapters[chapter] !== null) {
			mangaLanguages.push(value);
		}
	});

	return (
		<>
			<div
				className={classNames(styles.fakeSidebarContainer, {
					[styles.fakeSidebarContainerOpen]: openSidebar,
					[styles.fakeSidebarContainerHidden]: !openSidebar,
				})}
			/>
			<div
				className={classNames(styles.sidebarContainer, {
					[styles.sidebarContainerOpen]: openSidebar,
					[styles.sidebarContainerHidden]: !openSidebar,
				})}
				ref={containerRef}
			>
				{/* Manga info */}
				<div className="400 flex flex-col gap-2">
					<div className="flex flex-row content-center items-center justify-between">
						<div className="flex items-center gap-1">
							<BookOpenIcon width={30} />
							<strong className=" whitespace-nowrap">
								{mangaData.title}
							</strong>
						</div>
						<XMarkIcon
							onClick={() => setOpenSidebar(false)}
							className="size-9 rounded-full p-1 hover:bg-gray-200"
							width={30}
						/>
					</div>
					<div className="flex items-center gap-1">
						<DocumentIcon width={30} />
						<strong className=" whitespace-nowrap">
							{mangaData.chapters[chapter].title
								? mangaData.chapters[chapter].title
								: `${t('chapter')} ${chapter + 1}`}
						</strong>
					</div>
					<button
						className="btn justify-between whitespace-nowrap text-nowrap"
						type="button"
						onClick={() => modalRef.current?.showModal()}
					>
						{t('details')}
						<InformationCircleIcon className="setting-icon" />
					</button>
					<div className="flex w-full gap-1">
						<SettingButton
							value={mangaLanguage}
							valueList={mangaLanguages}
							disabled={mangaLanguages.length < 2}
							// @ts-ignore
							setValue={setMangaLanguage}
							label="manga"
						/>
						<SettingButton
							value={readerLanguage}
							valueList={languages}
							// @ts-ignore
							setValue={setReaderLanguage}
							label="reader"
						/>
					</div>
				</div>
				<div className="divider" />
				{/* Chapter and page seletion */}
				<div className="flex flex-col items-center gap-2">
					<SelectBox value={page} label="page" />
					<SelectBox value={chapter} label="chapter" />
				</div>
				<div className="divider" />
				{/* Reader settings */}
				<div className="flex flex-col gap-2">
					<SettingButton
						value={pageLayout}
						valueList={pageLayouts}
						// @ts-ignore
						setValue={setPageLayout}
					/>
					<SettingButton
						value={fitMode}
						valueList={fitModes}
						// @ts-ignore
						setValue={setFitMode}
					/>
					<SettingButton
						value={direction}
						valueList={directions}
						// @ts-ignore
						setValue={setDirection}
					/>
					<SettingButton
						value={headerVisibility}
						valueList={headerVisibilities}
						// @ts-ignore
						setValue={setHeaderVisibility}
					/>
					<SettingButton
						value={readerTheme}
						valueList={readerThemes}
						// @ts-ignore
						setValue={setReaderTheme}
						label="theme"
					/>
					<SettingButton
						value={progressVisibility}
						valueList={progressVisibilities}
						// @ts-ignore
						setValue={setProgressVisibility}
					/>
				</div>
			</div>
			<ReaderModal modalRef={modalRef} />
		</>
	);
}

export default ReaderSidebar;
