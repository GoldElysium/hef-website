'use client';

import { useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Project } from 'types/payload-types';

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
<<<<<<< 82e954e4225964fb0da31e93f0a43cf14dd1af46:src/ui/project/experimental/sana/DarkModeFlag.tsx
		if (project.en.flags?.includes('alwaysDarkMode')) setTheme('dark');
		if (project.en.flags?.includes('alwaysLightMode')) setTheme('light');
	}, [project.en.flags, setTheme]);
=======
		if (project.flags?.includes('alwaysDarkMode')) setDarkMode(true);
		if (project.flags?.includes('alwaysLightMode')) setDarkMode(false);
	}, []);
>>>>>>> feat(i18n): add i18n support:ui/project/experimental/sana/DarkModeFlag.tsx

	return null;
}
