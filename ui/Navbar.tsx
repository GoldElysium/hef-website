import Link from 'next/link';
import DarkModeToggle from 'ui/DarkModeToggle';
import NavbarMenu from 'ui/NavbarMenu';
import NoticeBanner from 'ui/NoticeBanner';

interface IProps {
	flags: string[];
}

export default function Navbar({ flags }: IProps) {
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
