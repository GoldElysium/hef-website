'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import DarkModeToggle from 'ui/DarkModeToggle';
import NavbarMenu from 'ui/NavbarMenu';
import NoticeBanner from 'ui/NoticeBanner';
import PayloadResponse from 'types/PayloadResponse';
import { Flag, Project } from 'types/payload-types';

export default function Navbar() {
	const pathname = usePathname();
	const [flags, setFlags] = useState<string[]>([]);

	useEffect(() => {
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

	if (flags.includes('disableNavbar')) return null;

	return (
		<>
			<NoticeBanner />
			<div className="flex w-full h-20 px-4 sm:px-8 justify-between items-center bg-skin-background-2 dark:bg-skin-dark-background-2">
				{/*
				<div>
					<Link href="/">
						<a>
							<img className="h-20 hidden" src="/img/logo_banner.png" alt="Logo" />
						</a>
					</Link>
				</div>
				*/}

				<div>
					<div className="sm:hidden relative">
						<NavbarMenu />
					</div>

					<div className="hidden sm:block flex items-center text-lg space-x-4">
						<Link href="/" className="text-white font-semibold hover:text-opacity-80">
							Home
						</Link>
						<Link
							href="/projects"
							className="text-white font-semibold hover:text-opacity-80"
						>
							Projects
						</Link>
					</div>
				</div>
				<DarkModeToggle />
			</div>
		</>
	);
}
