'use client';

import { useRef, useState } from 'react';
import Reader from './Reader';
import ReaderSidebar from './ReaderSidebar';
import { useMangaContext } from './context/MangaContext';
import { useKeyPress } from './hooks/useKeypress';

function IrysManga() {
	const { readerTheme } = useMangaContext();
	const [openSidebar, setOpenSidebar] = useState(true);
	const readerContainerRef = useRef(null);
	useKeyPress(setOpenSidebar, readerContainerRef);
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
		</div>
	);
}

export default IrysManga;
