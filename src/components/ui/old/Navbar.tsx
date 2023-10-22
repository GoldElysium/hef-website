'use client';

import { useLocale } from '@/components/contexts/LocaleContext';
import useTranslation from '@/lib/i18n/client';
import localizePathname from '@/lib/util/localizePathname';
import Link from 'next/link';
import DarkModeToggle from '@/components/ui/DarkModeToggle';
import NavbarMenu from '@/components/ui/old/NavbarMenu';
import NoticeBanner from '@/components/ui/old/NoticeBanner';
import LocaleSelect from '../util/LocaleSelect';

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
			<div className="bg-skin-background-2 dark:bg-skin-dark-background-2 flex h-20 w-full items-center justify-between px-4 sm:px-8">
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
					<div className="relative flex sm:hidden">
						<NavbarMenu />
					</div>

					<div className="hidden items-center space-x-4 text-lg sm:flex">
						<Link
							href={localizePathname(locale, '/')}
							hrefLang={locale}
							className="font-semibold text-white hover:text-opacity-80"
						>
							{t('home')}
						</Link>
						<Link
							href={localizePathname(locale, '/projects')}
							hrefLang={locale}
							className="font-semibold text-white hover:text-opacity-80"
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
