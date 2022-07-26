import { IEvent } from '../../../models/Project';

export interface ProjectTimelineProps {
	events: IEvent[],
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function ProjectTimeline({ events }: ProjectTimelineProps) {
	return (
		<div></div>
	);
}

export default ProjectTimeline;
