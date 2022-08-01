import { ReactNode, useEffect } from 'react';
import { createContext, useContext, useMemo } from 'react';

import { ProjectTabsContext } from './Tabs';

export const ProjectTabContext = createContext<ProjectTabContext | null>(null);

// eslint-disable-next-line @typescript-eslint/no-redeclare
export interface ProjectTabContext {
	readonly label: string,
}

export interface ProjectTabProps {
	label: string,
	children: ReactNode | ReactNode[],
}

export function ProjectTab({ label, children }: ProjectTabProps) {
	const childrenWrapper = useMemo(() => {
		return (
			<ProjectTabContext.Provider value={{ label }}>
				{children}
			</ProjectTabContext.Provider>
		);
	}, [ label, children ]);

	const { child, setChild, setAssociation } = useContext(ProjectTabsContext)!;

	useEffect(() => setAssociation(label, childrenWrapper), [ ]);

	return (
		<button>
			<h2
				className={
					'text-2xl text-center text-skin-primary-1 dark:text-skin-dark-primary-1 select-none mx-4 '
					+ ((childrenWrapper == child) ? 'font-bold' : '')
				}
				onClick={(e) => e.button == 0 && setChild(childrenWrapper)}
			>
				{label}
			</h2>
		</button>
	);
}

export default ProjectTab;
