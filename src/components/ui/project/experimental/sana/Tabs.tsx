'use client';

import {
	createContext, ReactNode, useMemo, useRef, useState,
} from 'react';

export const ProjectTabsContext = createContext<ProjectTabsContext | null>(null);

// eslint-disable-next-line @typescript-eslint/no-redeclare
export interface ProjectTabsContext {
	readonly child: ReactNode | null,
	readonly setChild: (child: ReactNode) => void,
	readonly setAssociation: (label: string, child: ReactNode) => void,
}

export interface ProjectTabsProps {
	defaultTab: string,
	children: ReactNode | ReactNode[],
}

export default function ProjectTabs({ defaultTab, children }: ProjectTabsProps) {
	const [child, rawSetChild] = useState<ReactNode | null>(null);
	const [hasSetChild, setHasSetChild] = useState<boolean>(false);

	const associations = useRef<Map<string, ReactNode>>(new Map());

	function setChild(childEl: ReactNode) {
		rawSetChild(childEl);
		setHasSetChild(true);
	}

	function setAssociation(label: string, childEl: ReactNode) {
		associations.current.set(label, childEl);
		if (!hasSetChild && defaultTab === label) {
			setChild(childEl);
		}
	}

	const providerValue = useMemo(() => ({ child, setChild, setAssociation }), [child]);

	return (
		<ProjectTabsContext.Provider value={providerValue}>
			<div className="my-4 flex flex-row flex-wrap content-center justify-evenly">{children}</div>
			<div>{child}</div>
		</ProjectTabsContext.Provider>
	);
}
