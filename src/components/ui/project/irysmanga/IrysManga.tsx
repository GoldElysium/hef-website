'use client';

import Reader from './Reader';
import ReaderSidebar from './ReaderSidebar';
import { MangaProvider } from './context/MangaContext';

function IrysManga() {
	return (
		<MangaProvider>
			<div className="flex h-screen">
				<Reader />
				<ReaderSidebar />
			</div>
		</MangaProvider>
	);
}

export default IrysManga;
