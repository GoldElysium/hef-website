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

	useEffect(() => {
		if (!openSidebar) {
			setClickCounter(-1);
		}
	}, [openSidebar]);

	return (
		<div className="relative flex h-screen min-w-[310px] overflow-hidden bg-skin-background text-skin-text dark:bg-skin-background-dark dark:text-skin-text-dark">
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
