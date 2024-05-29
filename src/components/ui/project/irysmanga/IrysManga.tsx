'use client';

import { useRef, useState } from 'react';
import Reader from './Reader';
import ReaderSidebar from './ReaderSidebar';
import { useMangaContext } from './context/MangaContext';
import KeyPressHandler from './KeyPressHandler';

function IrysManga() {
	const { readerTheme } = useMangaContext();
	const [openSidebar, setOpenSidebar] = useState(true);
	const readerContainerRef = useRef(null);
	return (
		<div
			className="relative flex h-screen min-w-[310px] overflow-hidden"
			data-theme={readerTheme}
		>
			<Reader
				setOpenSidebar={setOpenSidebar}
				containerRef={readerContainerRef}
			/>
			<ReaderSidebar
				openSidebar={openSidebar}
				setOpenSidebar={setOpenSidebar}
			/>
			<KeyPressHandler
				setOpenSidebar={setOpenSidebar}
				readerContainerRef={readerContainerRef}
			/>
		</div>
	);
}

export default IrysManga;
