import { useState } from 'react';
import classNames from 'classnames';
import { Bars3Icon } from '@heroicons/react/24/solid';
import ReaderSidebar from './ReaderSidebar';
import { useMangaContext } from './context/MangaContext';
import './styles/styles.css';

function ReaderHeader() {
	const { page, chapter, manga } = useMangaContext();
	const [openSidebar, setOpenSidebar] = useState(true);
	const [openTopbar, setOpenTopbar] = useState(true);

	const squareBtn = classNames('bg-slate-900 border-white border px-2');
	const topBarClasses = classNames(
		'relative flex flex-col items-center w-full gap-1 md:hidden transition-all duration-500 py-4 ',
		{
			'translate-y-0': openTopbar,
			'h-[120px]': openTopbar,
			'-translate-y-[120px]': !openTopbar,
			'h-[0px]': !openTopbar,
			'py-[0px]': !openTopbar,
		},
	);
	const currentChapter = manga.chapters[chapter];
	return (
		<>
			{!openTopbar && (
				<Bars3Icon
					className="barIcon absolute right-0 top-0 z-10 mr-4 mt-2 md:hidden"
					width={50}
					onClick={() => setOpenTopbar(true)}
				/>
			)}
			{/* eslint-disable */}
            <div className={topBarClasses}>
                <strong>{manga.title}</strong>
                <strong>{currentChapter.title}</strong>
                <div className="flex gap-2">
                    <div className={squareBtn}>
                        Chapter {chapter + 1} / {manga.chapterCount}
                    </div>
                    <div className={squareBtn}>
                        Page {page + 1} / {currentChapter.pageCount}
                    </div>
                    <div
                        className={squareBtn + " cursor-pointer"}
                        onClick={() => setOpenSidebar(true)}
                    >
                        Menu
                    </div>
                </div>
                {openTopbar && (
                    <Bars3Icon
                        className="absolute bottom-0 right-0 mb-2 mr-2 barIcon"
                        width={20}
                        onClick={() => setOpenTopbar(false)}
                    ></Bars3Icon>
                )}
            </div>
            {/* eslint-enable */}
			<ReaderSidebar
				openSidebar={openSidebar}
				setOpenSidebar={setOpenSidebar}
			/>
		</>
	);
}

export default ReaderHeader;
