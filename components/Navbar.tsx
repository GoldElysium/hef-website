import Link from 'next/link';
import { MenuIcon } from '@heroicons/react/solid';
import { Menu, Transition } from '@headlessui/react';
import { useState, Fragment } from 'react';
import { ClipboardListIcon, HomeIcon } from '@heroicons/react/outline';
import Head from './Head';
import DarkModeToggle from './DarkModeToggle';

interface IProps {
	disableHead?: boolean;
}

export default function Navbar({ disableHead }: IProps) {
	const [menuOpen, setMenuOpen] = useState(false);

	return (
		<div className="flex w-full h-20 px-4 sm:px-8 justify-between items-center bg-skin-background-2 dark:bg-skin-dark-background-2">
			{!disableHead && <Head />}

			{/*<div>
				<Link href="/">
					<a>
						<img className="h-20 hidden" src="/img/logo_banner.png" alt="Logo" />
					</a>
				</Link>
			</div>*/}

			<div>
				<div className="sm:hidden">
					<Menu as="div">
						<Menu.Button>
							<MenuIcon onClick={() => { setMenuOpen(!menuOpen); }} className="h-10 w-10 -mb-1 text-white sm:hidden" />
						</Menu.Button>
						<Transition
							show={menuOpen}
							as={Fragment}
							enter="transition ease-out duration-100"
							enterFrom="transform opacity-0 scale-95"
							enterTo="transform opacity-100 scale-100"
							leave="transition ease-in duration-75"
							leaveFrom="transform opacity-100 scale-100"
							leaveTo="transform opacity-0 scale-95"
						>
							<Menu.Items static className="absolute left-2 top-16 w-32 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none mr-2">
								<div className="px-2 py-1">
									<Menu.Item>
										<Link href="/">
											<a type="button" className="flex rounded-md items-center w-full">
												<HomeIcon className="h-6 w-6 text-skin-primary-1 mr-2" />
												Home
											</a>
										</Link>
									</Menu.Item>

									<Menu.Item>
										<Link href="/projects">
											<a type="button" className="flex rounded-md items-center w-full mt-1">
												<ClipboardListIcon className="h-6 w-6 text-skin-primary-1 mr-2" />
												Projects
											</a>
										</Link>
									</Menu.Item>
								</div>
							</Menu.Items>
						</Transition>
					</Menu>
				</div>

				<div className="hidden sm:block flex items-center text-lg space-x-4">
					<Link href="/">
						<a className="text-white font-semibold hover:text-opacity-80">Home</a>
					</Link>
					<Link href="/projects">
						<a className="text-white font-semibold hover:text-opacity-80">Projects</a>
					</Link>
				</div>
			</div>
			<DarkModeToggle />
		</div>
	);
}

Navbar.defaultProps = {
	disableHead: false,
};
