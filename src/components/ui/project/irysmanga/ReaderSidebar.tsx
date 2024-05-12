import classNames from 'classnames';
import { Bars3Icon } from '@heroicons/react/24/solid';
import { BookOpenIcon, DocumentIcon } from '@heroicons/react/24/outline';
import SelectBox from './SelectBox';
import { useMangaContext } from './context/MangaContext';

interface Props {
	openSidebar: boolean;
	setOpenSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}

function ReaderSidebar({ openSidebar, setOpenSidebar }: Props) {
	const {
		singlePageMode,
		page,
		chapter,
		fitHeightMode,
		language,
		leftToRight,
		headerHidden,
		readerTheme,
		manga,
		setSinglePageMode,
		setFitHeightMode,
		setLanguage,
		setLeftToRight,
		setHeaderHidden,
		setReaderTheme,
	} = useMangaContext();

	const containerClasses = classNames(
		'flex flex-col px-4 py-2 -z--1 absolute md:static bg-slate-800 transition-all duration-[150ms] ease-in-out overflow-y-auto h-full ',
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
					className="barIcon absolute ml-2 mt-2 hidden md:block"
					onClick={() => setOpenSidebar(true)}
					width={50}
				/>
			)}
			<div className={containerClasses}>
				<Bars3Icon
					color="#FFFFFF"
					onClick={() => setOpenSidebar(false)}
					width={30}
					className="barIcon absolute right-0 mr-2"
				/>
				{/* Manga info */}
				<div className="400 flex flex-col gap-2">
					<div className="flex items-center gap-1">
						<BookOpenIcon width={30} />
						<strong className=" whitespace-nowrap">
							{manga.title}
						</strong>
					</div>
					<div className="flex items-center gap-1">
						<DocumentIcon width={30} />
						<strong className=" whitespace-nowrap">
							{manga.chapters[chapter].title}
						</strong>
					</div>
					<button className="btn whitespace-nowrap" type="button">
						Details
					</button>
					<button
						className="btn whitespace-nowrap"
						type="button"
						onClick={() => {
							setLanguage(language === 'EN' ? 'JP' : 'EN');
						}}
					>
						Language:
						{' '}
						{language === 'EN' ? 'English' : '日本語'}
					</button>
				</div>
				<div className="divider" />
				{/* Chapter and page seletion */}
				<div className="flex flex-col items-center gap-2">
					<SelectBox value={page} label="Page" />
					<SelectBox value={chapter} label="Chapter" />
				</div>
				<div className="divider" />
				{/* Reader settings */}
				<div className="flex flex-col gap-2">
					<button
						className="btn whitespace-nowrap"
						type="button"
						onClick={() => setSinglePageMode((prev) => !prev)}
					>
						{singlePageMode ? 'Single Page' : 'Long Strip'}
					</button>
					<button
						className="btn whitespace-nowrap"
						type="button"
						onClick={() => setFitHeightMode((prev) => !prev)}
					>
						{fitHeightMode ? 'Fit Height' : 'Fit Width'}
					</button>
					<button
						className="btn whitespace-nowrap"
						type="button"
						onClick={() => setLeftToRight((prev) => !prev)}
					>
						{leftToRight ? 'Left To Right' : 'Right To Left'}
					</button>
					<button
						className="btn whitespace-nowrap"
						type="button"
						onClick={() => setHeaderHidden((prev) => !prev)}
					>
						{headerHidden ? 'Header Hidden' : 'Header Shown'}
					</button>
					<button
						className="btn whitespace-nowrap"
						type="button"
						onClick={() => setReaderTheme(
							readerTheme === 'light' ? 'dark' : 'light',
						)}
					>
						Theme:
						{' '}
						{readerTheme === 'light' ? 'Light' : 'Dark'}
					</button>
				</div>
			</div>
		</>
	);
}

export default ReaderSidebar;
