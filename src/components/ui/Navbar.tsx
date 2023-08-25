'use client';

import { useLocale } from 'components/contexts/LocaleContext';
import useTranslation from 'lib/i18n/client';
import localizePathname from 'lib/util/localizePathname';
import Link from 'next/link';
import DarkModeToggle from 'components/ui/DarkModeToggle';
import NavbarMenu from 'components/ui/NavbarMenu';
import NoticeBanner from 'components/ui/NoticeBanner';
import LocaleSelect from './LocaleSelect';

interface IProps {
	flags: string[];
}

export default function Navbar({ flags }: IProps) {
	if (flags.includes('disableNavbar')) return null;

	// eslint-disable-next-line react-hooks/rules-of-hooks
	const { locale } = useLocale();
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const { t } = useTranslation('layout', 'nav');

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
					<div className="flex sm:hidden relative">
						<NavbarMenu />
					</div>

					<div className="hidden sm:flex items-center text-lg space-x-4">
						<Link
							href={localizePathname(locale, '/')}
							hrefLang={locale}
							className="text-white font-semibold hover:text-opacity-80"
						>
							{t('home')}
						</Link>
						<Link
							href={localizePathname(locale, '/projects')}
							hrefLang={locale}
							className="text-white font-semibold hover:text-opacity-80"
						>
							{t('projects')}
						</Link>
					</div>
				</div>
				<div className="flex flex-row">
					<LocaleSelect />
					<DarkModeToggle />
				</div>
			</div>
		</>
	);
}
