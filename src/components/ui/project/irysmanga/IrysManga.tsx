'use client';

import { useState } from 'react';
import Reader from './Reader';
import ReaderSidebar from './ReaderSidebar';
import { useMangaContext } from './context/MangaContext';

function IrysManga() {
	const { readerTheme } = useMangaContext();
	const [openSidebar, setOpenSidebar] = useState(true);
	return (
		<div
			className="relative flex h-screen min-w-[310px] overflow-hidden"
			data-theme={readerTheme}
		>
			<Reader setOpenSidebar={setOpenSidebar} />
			<ReaderSidebar
				openSidebar={openSidebar}
				setOpenSidebar={setOpenSidebar}
			/>
		</div>
	);
}

export default IrysManga;
