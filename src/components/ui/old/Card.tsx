import { Language } from '@/lib/i18n/languages';
import localizePathname from '@/lib/util/localizePathname';
import Link from 'next/link';
import Image from '@/components/ui/old/Image';

interface IProps {
	img?: string,
	title: string,
	description: string,
	button: string,
	url: string,
	internal?: boolean,
	lang: Language
}

export default function Card({
	img, title, description, button, url, internal, lang,
}: IProps) {
	return (
		<div className="mt-4 w-full sm:w-1/3">
			<div
				className="bg-skin-card dark:bg-skin-dark-card dark:border-skin-dark-primary flex h-full flex-col items-center justify-between rounded-lg border-b-4 border-skin-primary
			 p-8 sm:mx-2 sm:p-3 md:p-8"
			>
				<div className="flex flex-col items-center">
					{img
						&& <Image className="h-32 rounded-full" src={img} alt="" width={128} height={128} />}
					<h2 className="mt-3 text-center text-xl font-bold text-black dark:text-white">
						{title}
					</h2>
					<p className="mt-2 text-center text-black text-opacity-80 dark:text-white">
						{description}
					</p>
				</div>
				{internal ? (
					<Link
						href={localizePathname(lang, url)}
						hrefLang={lang}
						className="bg-skin-secondary-1 dark:bg-skin-dark-secondary-1 mt-4 flex h-10 w-20 cursor-pointer content-end items-center justify-center
							rounded-3xl font-bold text-white hover:text-opacity-70"
					>
						{button}
					</Link>
				) : (
					<a href={url}>
						<div
							className="bg-skin-secondary-1 dark:bg-skin-dark-secondary-1 mt-4 flex h-10 w-20 cursor-pointer content-end items-center justify-center
							rounded-3xl font-bold text-white hover:text-opacity-70"
						>
							{button}
						</div>
					</a>
				)}
			</div>
		</div>
	);
}
