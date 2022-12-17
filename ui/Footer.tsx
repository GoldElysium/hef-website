'use client';

import { HeartIcon } from '@heroicons/react/24/solid';
import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { Flag, Project } from 'types/payload-types';
import PayloadResponse from 'types/PayloadResponse';
import { useCallback, useEffect, useState } from 'react';

export default function Footer() {
	const pathname = usePathname();

	// Work-around for Sana sendoff url transforms
	const [background, setBackground] = useState<string | null>(null);
	const [flags, setFlags] = useState<string[]>([]);

	useEffect(() => {
		// Work-around for Sana sendoff url transforms
		if (window && (
			window.location.host.endsWith('sanallites.space')
			|| window.location.host.endsWith('astrogirl.space'))) {
			setFlags(['sanaSendoff']);
			return;
		}

		const match = pathname?.match(/\/projects\/(?<slug>[a-zA-Z0-9\-_]+)/i);
		if (match?.groups?.slug) {
			(async () => {
				const res = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL!}/api/projects?where[slug][equals]=${match!.groups!.slug}&depth=2`);
				const parsedRes = (await res.json() as PayloadResponse<Project>);
				if (parsedRes.totalDocs === 0) return;

				const project = parsedRes.docs[0];

				const newFlags = (project.flags as Flag[] ?? []).map((flag) => flag.code);

				setFlags(newFlags);
			})();
		}
	}, [pathname]);

	useEffect(() => {
		if (flags.includes('sanaSendoff')) {
			setBackground('/assets/sanasendoff/background.png');
		}
	}, [flags]);

	const wrapper = useCallback((wrapperEl: HTMLDivElement) => {
		if (background && wrapperEl) {
			// eslint-disable-next-line no-param-reassign
			wrapperEl.style.backgroundImage = `url(${background})`;
		}
	}, [background]);

	if (flags.includes('disableFooter')) return null;

	return (
		<div
			className="flex w-full h-24 px-4 sm:px-8 justify-center items-center bg-skin-background-2 dark:bg-skin-dark-background-2"
			ref={wrapper}
		>
			<p className="text-center flex items-center text-white text-opacity-70">
				Made with&nbsp;
				<HeartIcon className="w-4 h-4 text-white" />
				&nbsp;by&nbsp;
				<a
					href="https://github.com/GoldElysium/hefs-website#contributors-"
					target="_blank"
					className="underline"
					rel="noreferrer"
				>
					fans
				</a>
			</p>

			{/* eslint-disable-next-line max-len */}
			{/* TODO: Decide between one of the two, Umami is more privacy friendly and will be less blocked as it's self-hosted */}
			<Script
				src="https://static.cloudflareinsights.com/beacon.min.js"
				data-cf-beacon='{"token": "5896757c09e04949bf74e7c34efd419a"}'
			/>
			<Script
				async
				defer
				src="https://umami.holoen.fans/umami.js"
				data-website-id="c381cce3-8dcc-4043-b46d-67b83a8bb80b"
				data-domains="holoen.fans,www.holoen.fans,astrogirl.space,sanallites.space,www.sanallites.space"
			/>
		</div>
	);
}
