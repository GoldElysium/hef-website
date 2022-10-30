import Link from 'next/link';
import Head from './Head';
import DarkModeToggle from './DarkModeToggle';
import NavbarMenu from './NavbarMenu';
import NoticeBanner from './NoticeBanner';

interface IProps {
	disableHead?: boolean;
}

export default function Navbar({ disableHead }: IProps) {
	return (
		<>
			<NoticeBanner />
			<div className="flex w-full h-20 px-4 sm:px-8 justify-between items-center bg-skin-background-2 dark:bg-skin-dark-background-2">
				{!disableHead && <Head />}

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
					<div className="sm:hidden">
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

Navbar.defaultProps = {
	disableHead: false,
};
