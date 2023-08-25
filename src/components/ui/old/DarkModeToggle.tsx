'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function DarkModeToggle() {
	const [mounted, setMounted] = useState(false);
	const { resolvedTheme, setTheme } = useTheme();

	// useEffect only runs on the client, so now we can safely show the UI
	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		// Return non-working toggle before client-side hydration
		return (
			<div className="flex flex-nowrap items-center align-middle">
				<label className="switch ml-6">
					<input
						type="checkbox"
						checked={false}
						readOnly
					/>
					<span className="slider round bg-skin-background-1 dark:bg-skin-dark-primary-1" />
				</label>
				<img
					src="/img/nightMode.svg"
					alt="Night Mode Icon"
					className="ml-2 inline h-auto w-8"
				/>
			</div>
		);
	}

	return (
		<div className="flex flex-nowrap items-center align-middle">
			<label className="switch ml-6">
				<input
					type="checkbox"
					onChange={() => {
						setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
					}}
					checked={resolvedTheme === 'dark'}
				/>
				<span className="slider round bg-skin-background-1 dark:bg-skin-dark-primary-1" />
			</label>
			<img
				src="/img/nightMode.svg"
				alt="Night Mode Icon"
				className="ml-2 inline h-auto w-8"
			/>
		</div>
	);
}
