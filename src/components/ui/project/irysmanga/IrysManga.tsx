'use client';

import Reader from './Reader';
import ReaderHeader from './ReaderHeader';
import { MangaProvider } from './context/MangaContext';

function IrysManga() {
	return (
		<MangaProvider>
			<div className="flex h-screen flex-col md:flex-row">
				<ReaderHeader />
				<Reader />
			</div>
		</MangaProvider>
	);
}

export default IrysManga;
