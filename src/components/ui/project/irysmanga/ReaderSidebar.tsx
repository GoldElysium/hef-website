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
	readerThemes,
} from './utils/types';
import SettingButton from './SettingButton';

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
		language,
		direction,
		headerVisibility,
		readerTheme,
		manga,
		setPageLayout,
		setFitMode,
		setLanguage,
		setDirection,
		setHeaderVisibility,
		setReaderTheme,
	} = useMangaContext();
	const modalRef = useRef<HTMLDialogElement>(null);
	const { t, i18n } = useTranslation('reader');
	useEffect(() => {
		i18n.changeLanguage(language);
	}, [language, i18n]);
	const mangaData = getMangaDataOrThrow(manga, language);

	const containerClasses = classNames(
		'flex flex-col px-4 py-2 border-accent border-r-2 border bg-base-100 absolute md:static transition-all duration-[150ms] ease-in-out overflow-y-auto h-full z-10 max-h-full bg-inherit',
		{
			'w-[300px]': openSidebar,
			'translate-x-0': openSidebar,
			'-translate-x-full': !openSidebar,
			'w-[0px]': !openSidebar,
			'px-[0px]': !openSidebar,
		},
	);

	return (
		<>
			{!openSidebar && (
				<Bars3Icon
					className="barIcon absolute z-10 ml-2 mt-2 hidden md:block"
					onClick={() => setOpenSidebar(true)}
					width={30}
				/>
			)}
			<div className={containerClasses}>
				<Bars3Icon
					onClick={() => setOpenSidebar(false)}
					className="barIcon absolute right-0 mr-2"
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
						className="btn btn-secondary justify-between whitespace-nowrap hover:btn-primary"
						type="button"
						onClick={() => modalRef.current?.showModal()}
					>
						{t('details')}
						<InformationCircleIcon className="setting-icon" />
					</button>
					<SettingButton
						value={language}
						valueList={languages}
						// @ts-ignore
						setValue={setLanguage}
						label="language"
					/>
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
