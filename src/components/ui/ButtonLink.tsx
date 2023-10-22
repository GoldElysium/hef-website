import { Language } from '@/lib/i18n/languages';
import Link from 'next/link';
import localizePathname from '@/lib/util/localizePathname';

interface IProps {
	text: string;
	url: string;
	internal?: boolean;
	lang: Language;
	forceLightMode?: boolean;
}

export default function ButtonLink({
	url, internal, lang, text, forceLightMode,
}: IProps) {
	return (
		internal ? (
			<Link
				href={localizePathname(lang, url)}
				hrefLang={lang}
				className={`flex h-10 cursor-pointer content-end items-center justify-center rounded-3xl bg-skin-primary px-4
					font-bold text-white hover:text-opacity-70 ${forceLightMode ? '' : 'dark:bg-skin-primary-dark'}`}
			>
				{text}
			</Link>
		) : (
			<a href={url}>
				<div
					className={`flex h-10 cursor-pointer content-end items-center justify-center rounded-3xl bg-skin-primary px-4
							font-bold text-white hover:text-opacity-70 ${forceLightMode ? '' : 'dark:bg-skin-primary-dark'}`}
				>
					{text}
				</div>
			</a>
		)
	);
}
