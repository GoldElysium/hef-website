import { HeartIcon } from '@heroicons/react/solid';

export default function Footer() {
	return (
		<div className="flex w-full bg-red-500 h-24 px-4 sm:px-8 justify-center items-center mt-16">
			<p className="text-center text-red-200 flex items-center">Made with&nbsp;<HeartIcon className="w-4 h-4 text-white" />&nbsp;by&nbsp;<a href="https://github.com/GoldElysium" target="_blank" className="underline" rel="noreferrer">GoldElysium</a></p>
		</div>
	);
}