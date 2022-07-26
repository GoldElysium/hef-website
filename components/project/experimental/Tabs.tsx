import { ReactNode } from 'react';
import { createContext, useState } from 'react';

export const ProjectTabsContext = createContext<ProjectTabsContext | null>(null);

// eslint-disable-next-line @typescript-eslint/no-redeclare
export interface ProjectTabsContext {
	readonly child: ReactNode | null,
	readonly setChild: (child: ReactNode) => void,
}

export interface ProjectTabsProps {
	children: ReactNode | ReactNode[],
}

export function ProjectTabs({ children }: ProjectTabsProps) {
	const [child, setChild] = useState<ReactNode | null>(null);

	return (
		<ProjectTabsContext.Provider value={{ child, setChild }}>
			<div className="flex flex-row justify-evenly content-center">{children}</div>
			<div>{child}</div>
		</ProjectTabsContext.Provider>
	);
}

export default ProjectTabs;
