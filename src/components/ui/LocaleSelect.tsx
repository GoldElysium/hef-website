'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { Fragment } from 'react';
import { useLocale } from 'components/contexts/LocaleContext';
import localizePathname from 'lib/util/localizePathname';
import { Languages } from 'lib/i18n/languages';
import { LanguageIcon } from '@heroicons/react/24/outline';

export default function LocaleSelect() {
	const { locale } = useLocale();
	const pathName = usePathname();

	return (
		<div className="top-16 w-56 text-right">
			<Menu as="div" className="relative inline-block text-left">
				<div>
					<Menu.Button className="inline-flex w-full justify-center rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
						<LanguageIcon height={24} />
						<ChevronDownIcon
							className="ml-2 -mr-1 h-5 w-5 text-white"
							aria-hidden="true"
						/>
					</Menu.Button>
				</div>
				<Transition
					as={Fragment}
					enter="transition ease-out duration-100"
					enterFrom="transform opacity-0 scale-95"
					enterTo="transform opacity-100 scale-100"
					leave="transition ease-in duration-75"
					leaveFrom="transform opacity-100 scale-100"
					leaveTo="transform opacity-0 scale-95"
				>
					<Menu.Items className="absolute top-10 w-32 origin-top-right bg-skin-background-1 divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none mr-2 dark:bg-skin-dark-background-1">
						<div className="px-1 py-1 ">
							{Object.values(Languages).map((language) => (
								<Menu.Item key={language.id}>
									{({ active }) => {
										let style: string = '';
										if (locale === language.id) {
											style = 'bg-skin-secondary-1 dark:bg-skin-dark-secondary-1';
										} else if (active) {
											style = 'backdrop-brightness-75 dark:backdrop-brightness-125';
										}

										return (
											<Link
												href={localizePathname(language.id, pathName)}
												hrefLang={language.id}
												type="button"
												className={`${style} flex rounded-md items-center w-full px-2 py-2 text-black dark:text-white`}
											>
												<img
													loading="lazy"
													width="20"
													height="20"
													src={language.icon}
													alt={`${language.name} flag`}
												/>
												<span className="pl-2">{language.name}</span>
											</Link>
										);
									}}
								</Menu.Item>
							))}
						</div>
					</Menu.Items>
				</Transition>
			</Menu>
		</div>
	);
}
