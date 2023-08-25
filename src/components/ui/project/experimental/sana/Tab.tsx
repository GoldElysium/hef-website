'use client';

import {
	ReactNode, useEffect, createContext, useContext, useMemo,
} from 'react';
import { ProjectTabsContext } from 'components/ui/project/experimental/sana/Tabs';

export const ProjectTabContext = createContext<ProjectTabContext | null>(null);

// eslint-disable-next-line @typescript-eslint/no-redeclare
export interface ProjectTabContext {
	readonly label: string,
}

export interface ProjectTabProps {
	label: string,
	children: ReactNode | ReactNode[],
}

export default function ProjectTab({ label, children }: ProjectTabProps) {
	const labelMemo = useMemo(() => ({ label }), [label]);

	const childrenWrapper = useMemo(() => (
		<ProjectTabContext.Provider value={labelMemo}>
			{children}
		</ProjectTabContext.Provider>
	), [labelMemo, children]);

	const { child, setChild, setAssociation } = useContext(ProjectTabsContext)!;

	useEffect(() => setAssociation(label, childrenWrapper), [childrenWrapper, label, setAssociation]);

	return (
		<button type="button">
			{/* eslint-disable-next-line max-len */}
			{/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions */}
			<h2
				className={
					`text-skin-primary-1 dark:text-skin-dark-primary-1 mx-4 select-none text-center text-2xl ${
						(childrenWrapper === child) ? 'font-bold' : ''}`
				}
				onClick={(e) => e.button === 0 && setChild(childrenWrapper)}
			>
				{label}
			</h2>
		</button>
	);
}
