'use client';

import { useCallback } from 'react';

interface IProps {
	title: string,
	description: string,
	background?: string,
}

export default function Header({ title, description, background }: IProps) {
	const wrapper = useCallback((wrapperEl: HTMLDivElement) => {
		if (background && wrapperEl) {
			// eslint-disable-next-line no-param-reassign
			wrapperEl.style.backgroundImage = `url(${background})`;
		}
	}, [background]);

	return (
		<div
			className="bg-skin-background-2 dark:bg-skin-dark-background-2 flex w-full items-center justify-center px-4 py-2
		  pb-4 text-center text-white"
			ref={wrapper}
		>
			<div className="flex max-w-4xl flex-col">
				<h1 className="text-bold text-5xl">{title}</h1>
				<p className="my-4 text-2xl text-white text-opacity-80">{description}</p>
			</div>
		</div>
	);
}
