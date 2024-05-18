'use client';

import IrysManga from '@/components/ui/project/irysmanga/IrysManga';
import { MangaProvider } from '@/components/ui/project/irysmanga/context/MangaContext';

function DefaultPage() {
	return (
		<MangaProvider>
			<IrysManga />
		</MangaProvider>
	);
}

export default DefaultPage;
