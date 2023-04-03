'use client';

import { useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Project } from 'types/payload-types';

export interface ProjectPageProps {
	project: {
		en: Omit<Project, 'flags' | 'devprops'> & {
			flags: string[];
			devprops: {
				[key: string]: string;
			};
		};
		jp: {
			title: Project['title'];
			shortDescription: Project['shortDescription'];
			description: Project['description'];
		};
	};
}
export default function DarkModeFlag({ project }: ProjectPageProps) {
	const { setTheme } = useTheme();

	useEffect(() => {
		if (project.en.flags?.includes('alwaysDarkMode')) setTheme('dark');
		if (project.en.flags?.includes('alwaysLightMode')) setTheme('light');
	}, [project.en.flags, setTheme]);

	return null;
}
