'use client';

import { useContext, useEffect } from 'react';
import DarkModeContext from 'contexts/DarkModeContext';
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
	const { setDarkMode } = useContext(DarkModeContext);

	useEffect(() => {
		if (project.en.flags?.includes('alwaysDarkMode')) setDarkMode(true);
		if (project.en.flags?.includes('alwaysLightMode')) setDarkMode(false);
	}, []);

	return null;
}
