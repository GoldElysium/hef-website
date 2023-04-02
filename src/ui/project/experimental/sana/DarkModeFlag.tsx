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
	const { theme, setTheme } = useTheme();

	useEffect(() => {
		const oldTheme = theme;

		if (project.en.flags?.includes('alwaysDarkMode')) setTheme('dark');
		if (project.en.flags?.includes('alwaysLightMode')) setTheme('light');

		return () => {
			if (oldTheme) {
				setTheme(oldTheme);
			}
		};
	}, [project.en.flags, setTheme, theme]);

	return null;
}
