import classNames from 'classnames';
import { Bars3Icon } from '@heroicons/react/24/solid';
import { BookOpenIcon, DocumentIcon } from '@heroicons/react/24/outline';
import { useEffect, useRef } from 'react';
import useTranslation from '@/lib/i18n/client';
import SelectBox from './SelectBox';
import { useMangaContext } from './context/MangaContext';
import {
	fitModes,
	getMangaDataOrThrow,
	languages,
	pageLayouts,
	readerThemes,
} from './utils/types';
import { getNextOption } from './utils/helper';

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
		leftToRight,
		headerHidden,
		readerTheme,
		manga,
		setPageLayout,
		setFitMode,
		setLanguage,
		setLeftToRight,
		setHeaderHidden,
		setReaderTheme,
	} = useMangaContext();
	const modalRef = useRef<HTMLDialogElement>(null);
	const { t, i18n } = useTranslation('reader');
	useEffect(() => {
		i18n.changeLanguage(language);
	}, [language, i18n]);
	const mangaData = getMangaDataOrThrow(manga, language);

	const containerClasses = classNames(
		'flex flex-col px-4 py-2  absolute md:static bg-slate-800 transition-all duration-[150ms] ease-in-out overflow-y-auto h-full z-10',
		{
			'w-[379px]': openSidebar,
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
					width={50}
				/>
			)}
			<div className={containerClasses}>
				<Bars3Icon
					onClick={() => setOpenSidebar(false)}
					width={30}
					className="barIcon absolute right-0 mr-2"
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
						className="btn whitespace-nowrap"
						type="button"
						onClick={() => modalRef.current?.showModal()}
					>
						{t('details')}
					</button>
					<button
						className="btn whitespace-nowrap"
						type="button"
						onClick={() => {
							setLanguage((prev) => getNextOption(prev, languages));
						}}
					>
						{t('language')}
						{': '}
						{t('chosen_language')}
					</button>
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
					<button
						className="btn whitespace-nowrap"
						type="button"
						onClick={() => setPageLayout((prev) => getNextOption(prev, pageLayouts))}
					>
						{t(pageLayout)}
					</button>
					<button
						className="btn whitespace-nowrap"
						type="button"
						onClick={() => setFitMode((prev) => getNextOption(prev, fitModes))}
					>
						{t(fitMode)}
					</button>
					<button
						className="btn whitespace-nowrap"
						type="button"
						onClick={() => setLeftToRight((prev) => !prev)}
					>
						{leftToRight ? t('ltr') : t('rtl')}
					</button>
					<button
						className="btn whitespace-nowrap"
						type="button"
						onClick={() => setHeaderHidden((prev) => !prev)}
					>
						{headerHidden ? t('header_hidden') : t('header_shown')}
					</button>
					<button
						className="btn whitespace-nowrap"
						type="button"
						onClick={() => setReaderTheme((prev) => getNextOption(prev, readerThemes))}
					>
						{t('theme')}
						:
						{t(readerTheme)}
					</button>
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
