'use client';

import Reader from './Reader';
import ReaderSiderContainer from './ReaderSiderbarContainer';
import { MangaProvider } from './context/MangaContext';

function IrysManga() {
	return (
		<MangaProvider>
			<div className="flex h-screen flex-col md:flex-row">
				<ReaderSiderContainer />
				<Reader />
			</div>
		</MangaProvider>
	);
}

export default IrysManga;
