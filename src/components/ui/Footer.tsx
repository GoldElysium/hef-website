import { HeartIcon } from '@heroicons/react/24/solid';
import Script from 'next/script';

interface IProps {
	flags: string[];
}

export default function Footer({ flags }: IProps) {
	if (flags.includes('disableFooter')) return null;

	return (
		<>
			<footer>
				<svg
					className="-mb-1 w-full bg-skin-background text-skin-header dark:bg-skin-background-dark dark:text-skin-header-dark"
					viewBox="0 0 1920 83"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M0 72.3337L32 63.5064C64 54.6791 128 37.0245 192 35.3694C256 33.5304 320 47.6908 384 47.6908C448 47.6908 512 33.5304 576 31.8753C640 30.0363 704 40.7026 768 44.1967C832 47.6908 896 44.1967 960 37.0245C1024 30.0363 1088 19.3699 1152 10.5427C1216 1.71537 1280 -5.2729 1344 5.3934C1408 15.8758 1472 44.1967 1536 53.024C1600 61.8513 1664 51.185 1728 47.6908C1792 44.1967 1856 47.6908 1888 49.5299L1920 51.185V83H1888C1856 83 1792 83 1728 83C1664 83 1600 83 1536 83C1472 83 1408 83 1344 83C1280 83 1216 83 1152 83C1088 83 1024 83 960 83C896 83 832 83 768 83C704 83 640 83 576 83C512 83 448 83 384 83C320 83 256 83 192 83C128 83 64 83 32 83H0V72.3337Z"
						fill="currentColor"
					/>
				</svg>
				<div className="flex h-24 w-full items-center justify-center bg-skin-header px-4 text-skin-header-foreground dark:bg-skin-header-dark dark:text-skin-header-foreground-dark sm:px-8">
					<span className="flex items-center whitespace-pre-wrap text-center text-lg font-semibold text-white">
						Made with
						{' '}
						<HeartIcon className="size-4 text-white" />
						{' '}
						by
						{' '}
						<a
							href="https://github.com/GoldElysium/hefs-website#contributors-"
							target="_blank"
							className="underline"
							rel="noreferrer"
						>
							fans
						</a>
					</span>
				</div>

			</footer>
			{/* <Script
				src="https://static.cloudflareinsights.com/beacon.min.js"
				data-cf-beacon='{"token": "5896757c09e04949bf74e7c34efd419a"}'
			/> */}
		</>
	);
}
