import classNames from 'classnames';
import { Bars3Icon } from '@heroicons/react/24/solid';
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
	readerThemes,
} from './utils/types';
import SettingButton from './SettingButton';
import styles from './styles/Sidebar.module.css';

interface Props {
	openSidebar: boolean;
	setOpenSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}

function ReaderSidebar({ openSidebar, setOpenSidebar }: Props) {
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
	const modalRef = useRef<HTMLDialogElement>(null);
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
			) {
				setOpenSidebar(false);
			}
		};

		// Set your threshold here (e.g., 768 for small screens)
		document.addEventListener('mousedown', handleClickOutside);

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [setOpenSidebar]);

	return (
		<>
			{!openSidebar && headerVisibility === 'header-hidden' && (
				<Bars3Icon
					className="barIcon absolute right-0 z-10 mr-4 mt-2"
					onClick={() => setOpenSidebar(true)}
					width={30}
				/>
			)}
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
				<Bars3Icon
					onClick={() => setOpenSidebar(false)}
					className="barIcon invisible absolute right-0 mr-2 md:visible"
					width={30}
				/>
				{/* Manga info */}
				<div className="400 flex flex-col gap-2">
					<div className="flex items-center gap-1">
						<BookOpenIcon width={30} />
						<strong className=" whitespace-nowrap">
							{mangaData.title}
						</strong>
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
							valueList={languages}
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

			<dialog id="info_modal" className="modal" ref={modalRef}>
				<div className="modal-box">
					<h3>Info and credits</h3>
					<div className="modal-action">
						<form method="dialog">
							{/* eslint-disable */}
                            <button className="btn">Close</button>
                            {/* // eslint-enable */}
                        </form>
                    </div>
                </div>
            </dialog>
        </>
	);
}

export default ReaderSidebar;
