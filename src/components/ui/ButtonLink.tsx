import { Language } from '@/lib/i18n/languages';
import Link from 'next/link';
import localizePathname from '@/lib/util/localizePathname';
import { ReactNode } from 'react';

interface IProps {
	text?: string;
	children?: ReactNode;
	url: string;
	internal?: boolean;
	lang: Language;
	forceLightMode?: boolean;
	className?: string;
}

export default function ButtonLink({
	url, internal, lang, text, children, forceLightMode, className,
}: IProps) {
	return (
		internal ? (
			<Link
				href={localizePathname(lang, url)}
				hrefLang={lang}
				className={`flex h-10 cursor-pointer content-end items-center justify-center rounded-lg bg-skin-primary px-4
					font-bold text-skin-primary-foreground hover:text-opacity-70 ${forceLightMode ? '' : 'dark:bg-skin-primary-dark dark:text-skin-primary-foreground-dark'} ${className}`}
			>
				{text ?? children}
			</Link>
		) : (
			<a href={url}>
				<div
					className={`flex h-10 cursor-pointer content-end items-center justify-center rounded-lg bg-skin-primary px-4
							font-bold text-skin-primary-foreground hover:text-opacity-70 ${forceLightMode ? '' : 'dark:bg-skin-primary-dark dark:text-skin-primary-foreground-dark'}`}
				>
					{text ?? children}
				</div>
			</a>
		)
	);
}
