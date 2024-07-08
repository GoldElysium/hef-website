'use client';

import { useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Project } from '@/types/payload-types';

export interface ProjectPageProps {
	project: Omit<Project, 'flags' | 'devprops'> & {
		flags: string[];
		devprops: {
			[key: string]: string;
		};
	};
}
export default function DarkModeFlag({ project }: ProjectPageProps) {
	const { setTheme } = useTheme();

	useEffect(() => {
		if (project.flags?.includes('alwaysDarkMode')) setTheme('dark');
		if (project.flags?.includes('alwaysLightMode')) setTheme('light');
	}, [project.flags, setTheme]);

	return null;
}
