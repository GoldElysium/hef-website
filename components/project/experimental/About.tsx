
import ProjectDescription from '../Description';
import ProjectGallery from '../Gallery';
import ProjectLinks from './Links';
import { IProject } from '../../../models/Project';

export interface ProjectAboutProps {
	project: IProject,
}

export function ProjectAbout({ project }: ProjectAboutProps) {
	return (
		<>
			<ProjectDescription description={project.description}/>
			{(project.media?.length ?? 0) > 0 && (
				<ProjectGallery media={project.media!}/>
			)}
			{(project.media?.length ?? 0) > 0 && (
				<ProjectLinks links={project.links!}/>
			)}
		</>
	);
}

export default ProjectAbout;
