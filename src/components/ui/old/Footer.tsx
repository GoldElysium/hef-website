import { HeartIcon } from '@heroicons/react/24/solid';
import Script from 'next/script';

interface IProps {
	flags: string[];
}

export default function Footer({ flags }: IProps) {
	if (flags.includes('disableFooter')) return null;

	return (
		<footer
			className="bg-skin-background-2 dark:bg-skin-dark-background-2 flex h-24 w-full items-center justify-center px-4 sm:px-8"
			style={{
				backgroundImage: flags.includes('sanaSendoff') ? 'url(/assets/sanasendoff/background.png)' : undefined,
			}}
		>
			<p className="flex items-center text-center text-white text-opacity-70">
				Made with&nbsp;
				<HeartIcon className="size-4 text-white" />
				&nbsp;by&nbsp;
				<a
					href="https://github.com/GoldElysium/hefs-website#contributors-"
					target="_blank"
					className="underline"
					rel="noreferrer"
				>
					fans
				</a>
			</p>

			<Script
				src="https://static.cloudflareinsights.com/beacon.min.js"
				data-cf-beacon='{"token": "5896757c09e04949bf74e7c34efd419a"}'
			/>
		</footer>
	);
}
