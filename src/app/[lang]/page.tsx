'use client';

import IrysManga from '@/components/ui/project/irysmanga/IrysManga';
import { MangaProvider } from '@/components/ui/project/irysmanga/context/MangaContext';
import { Jura } from 'next/font/google';

const jura = Jura({
	weight: ['700'],
	subsets: ['latin'],
});
function DefaultPage() {
	return (
		<div className={jura.className}>
			<MangaProvider>
				<IrysManga />
			</MangaProvider>
		</div>
	);
}

export default DefaultPage;
