'use client';

import { useEffect, useRef, useState } from 'react';
import Reader from './Reader';
import ReaderSidebar from './ReaderSidebar';
import KeyPressHandler from './KeyPressHandler';

export default function IrysManga() {
	const [openSidebar, setOpenSidebar] = useState(true);
	const [clickCounter, setClickCounter] = useState(0);

	const readerContainerRef = useRef(null);
	const modalRef = useRef(null);

	// Set a counter to detect click counts, necessary for closing the sidebar
	// when clicked outside without triggering the page turning
	useEffect(() => {
		if (!openSidebar) {
			setClickCounter(-1);
		}
	}, [openSidebar]);

	return (
		<div className="relative flex h-screen min-w-[310px] overflow-hidden bg-skin-background text-skin-text dark:bg-skin-background-dark dark:text-skin-text-dark">
			<Reader
				openSidebar={openSidebar}
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
