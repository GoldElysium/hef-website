import { ReactNode, useRef } from 'react';
import { createContext, useState } from 'react';

export const ProjectTabsContext = createContext<ProjectTabsContext | null>(null);

// eslint-disable-next-line @typescript-eslint/no-redeclare
export interface ProjectTabsContext {
	readonly child: ReactNode | null,
	readonly setChild: (child: ReactNode) => void,
	readonly setAssociation: (label: string, child: ReactNode) => void,
}

export interface ProjectTabsProps {
	default: string,
	children: ReactNode | ReactNode[],
}

export function ProjectTabs(props: ProjectTabsProps) {
	const [child, rawSetChild] = useState<ReactNode | null>(null);
	const [hasSetChild, setHasSetChild] = useState<boolean>(false);

	const associations = useRef<Map<string, ReactNode>>(new Map());

	function setChild(childDeez: ReactNode) {
		rawSetChild(childDeez);
		setHasSetChild(true);
	}

	function setAssociation(label: string, childDeez: ReactNode) {
		associations.current.set(label, childDeez);
		if (!hasSetChild && props.default == label) {
			setChild(childDeez);
		}
	}

	return (
		<ProjectTabsContext.Provider value={{ child: child, setChild, setAssociation }}>
			<div className="flex flex-row justify-evenly content-center my-4">{props.children}</div>
			<div>{child}</div>
		</ProjectTabsContext.Provider>
	);
}

export default ProjectTabs;
