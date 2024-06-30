'use client';

import { useRef, useState } from 'react';
import Reader from './Reader';
import ReaderSidebar from './ReaderSidebar';
import KeyPressHandler from './KeyPressHandler';

export default function IrysManga() {
	const [openSidebar, setOpenSidebar] = useState(true);

	const readerContainerRef = useRef(null);
	const modalRef = useRef(null);

	return (
		<div className="relative flex h-screen w-screen min-w-[310px] flex-row-reverse overflow-hidden bg-skin-background text-skin-text dark:bg-skin-background-dark dark:text-skin-text-dark">
			<ReaderSidebar
				openSidebar={openSidebar}
				setOpenSidebar={setOpenSidebar}
				modalRef={modalRef}
			/>
			<Reader
				openSidebar={openSidebar}
				setOpenSidebar={setOpenSidebar}
				containerRef={readerContainerRef}
			/>
			<KeyPressHandler
				setOpenSidebar={setOpenSidebar}
				readerContainerRef={readerContainerRef}
				modalRef={modalRef}
			/>
		</div>
	);
}
