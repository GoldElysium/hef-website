'use client';

import { useTheme } from 'next-themes';
import * as Switch from '@radix-ui/react-switch';
import { useEffect, useState } from 'react';

export default function DarkModeToggle() {
	const { resolvedTheme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return (
			<div className="ml-6 flex flex-nowrap items-center gap-2 align-middle">
				<Switch.Root
					checked={false}
					className="h-10 w-[4.25rem] rounded-full bg-black/40 px-2"
					disabled
				>
					<Switch.Thumb className="block size-6 rounded-full bg-white/80 transition-transform duration-150 data-[state=checked]:translate-x-7 motion-reduce:transition-none" />
				</Switch.Root>
				<img
					src="/img/nightMode.svg"
					alt="Night Mode Icon"
					className="inline h-auto w-8"
				/>
			</div>
		);
	}

	return (
		<div className="ml-6 flex flex-nowrap items-center gap-2 align-middle">
			<Switch.Root
				checked={resolvedTheme === 'dark'}
				onCheckedChange={() => {
					setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
				}}
				className="h-10 w-[4.25rem] rounded-full bg-black/40 px-2"
			>
				<Switch.Thumb className="block size-6 rounded-full bg-white/80 transition-transform duration-150 data-[state=checked]:translate-x-7 motion-reduce:transition-none" />
			</Switch.Root>
			<img
				src="/img/nightMode.svg"
				alt="Night Mode Icon"
				className="inline h-auto w-8"
			/>
		</div>
	);
}
