import Link from 'next/link';
import { LogoutIcon } from '@heroicons/react/solid';
import { Menu, Transition } from '@headlessui/react';
import { useState, Fragment, useEffect } from 'react';
import Head from 'next/head';
import { getSession, signOut } from 'next-auth/client';

export default function DashboardNavbar() {
	const [menuOpen, setMenuOpen] = useState(false);
	const [name, setName] = useState('');

	useEffect(() => {
		async function run() {
			const session = await getSession();
			if (session) setName(session.user?.name ?? '');
		}

		run();
	}, []);

	return (
		<div className="flex w-full bg-red-500 h-20 px-4 sm:px-8 justify-between items-center">
			<Head>
				<title>Hololive EN Fan Website - Dashboard</title>
			</Head>

			<div>
				<Link href="/dashboard">
					<a>
						<img className="h-20" src="/img/logo_banner.png" alt="Logo"/>
					</a>
				</Link>
			</div>

			<div className="flex items-center">
				<div className="flex items-center text-white text-lg hover:text-red-100">
					<Link href="/">
						<a>Home</a>
					</Link>
				</div>
				<Menu as="div">
					<Menu.Button>
						{/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
						<div onClick={() => {setMenuOpen(!menuOpen);}} className="text-white font-bold mr-8 ml-12 text-right">
							{name ?? 'Error'}
						</div>
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
						<Menu.Items static className="absolute right-0 w-32 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none mr-2">
							<div className="px-2 py-1">
								<Menu.Item>
									{/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
									<div className="flex rounded-md items-center w-full cursor-pointer" onClick={() => signOut({ callbackUrl: '/' })}>
										<LogoutIcon className="h-6 w-6 text-red-500 mr-2" />
										Logout
									</div>
								</Menu.Item>
							</div>
						</Menu.Items>
					</Transition>
				</Menu>
			</div>
		</div>
	);
}