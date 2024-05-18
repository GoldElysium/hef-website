'use client';

import Reader from './Reader';
import ReaderHeader from './ReaderHeader';
import { useMangaContext } from './context/MangaContext';

function IrysManga() {
	const { readerTheme } = useMangaContext();
	return (
		<div
			className="flex h-screen flex-col md:flex-row"
			data-theme={readerTheme}
		>
			<ReaderHeader />
			<Reader />
		</div>
	);
}

export default IrysManga;
