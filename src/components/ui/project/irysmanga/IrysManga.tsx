'use client';

import { useEffect, useRef, useState } from 'react';
import Reader from './Reader';
import ReaderSidebar from './ReaderSidebar';
import { useMangaContext } from './context/MangaContext';
import KeyPressHandler from './KeyPressHandler';

function IrysManga() {
	const { readerTheme } = useMangaContext();
	const [openSidebar, setOpenSidebar] = useState(true);
	const [clickCounter, setClickCounter] = useState(0);

	const readerContainerRef = useRef(null);
	const modalRef = useRef(null);

	useEffect(() => {
		if (!openSidebar) {
			setClickCounter(-1);
		}
	}, [openSidebar]);

	return (
		<div
			className="relative flex h-screen min-w-[310px] overflow-hidden"
			data-theme={readerTheme}
		>
			<Reader
				setOpenSidebar={setOpenSidebar}
				clickCounter={clickCounter}
				setClickCounter={setClickCounter}
				containerRef={readerContainerRef}
			/>
			<ReaderSidebar
				openSidebar={openSidebar}
				setOpenSidebar={setOpenSidebar}
				modalRef={modalRef}
			/>
			<KeyPressHandler
				setOpenSidebar={setOpenSidebar}
				readerContainerRef={readerContainerRef}
				modalRef={modalRef}
			/>
		</div>
	);
}

export default IrysManga;
