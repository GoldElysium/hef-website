'use client';

import { Menu, Transition } from '@headlessui/react';
import { Bars3Icon } from '@heroicons/react/24/solid';
import React, { Fragment, useState } from 'react';
import Link from 'next/link';
import { HomeIcon, ListBulletIcon } from '@heroicons/react/24/outline';
import { useLocale } from 'components/contexts/LocaleContext';
import localizePathname from 'lib/util/localizePathname';
import useTranslation from 'lib/i18n/client';

export default function NavbarMenu() {
	const [menuOpen, setMenuOpen] = useState(false);
	const { locale } = useLocale();
	const { t } = useTranslation('layout', 'nav');

	return (
		<Menu as="div">
			<Menu.Button>
				<Bars3Icon onClick={() => { setMenuOpen(!menuOpen); }} className="h-10 w-10 -mb-1 text-white sm:hidden" />
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

				<Menu.Items static className="absolute top-10 w-32 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none mr-2 dark:bg-skin-dark-background-2">
					<div className="px-2 py-1">
						<Menu.Item>
							<Link
								href={localizePathname(locale, '/')}
								hrefLang={locale}
								type="button"
								className="flex rounded-md items-center w-full"
							>
								<HomeIcon className="h-6 w-6 text-skin-primary-1 mr-2" />
								{t('home')}
							</Link>
						</Menu.Item>

						<Menu.Item>
							<Link
								href={localizePathname(locale, '/projects')}
								hrefLang={locale}
								type="button"
								className="flex rounded-md items-center w-full mt-1"
							>
								<ListBulletIcon className="h-6 w-6 text-skin-primary-1 mr-2" />
								{t('projects')}
							</Link>
						</Menu.Item>
					</div>
				</Menu.Items>
			</Transition>
		</Menu>
	);
}
