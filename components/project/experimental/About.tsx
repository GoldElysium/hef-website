
import ProjectDescription from '../Description';
import ProjectGallery from '../Gallery';
import ProjectLinks from './Links';
import { IProject } from '../../../models/Project';

export interface ProjectAboutProps {
	project: IProject,
}

export function ProjectAbout({ project }: ProjectAboutProps) {
	if (project.flags?.includes('bigAbout')) {
		return (
			<p className='flex justify-center content-center text-black dark:text-white dark:text-opacity-80 text-4xl text-center my-16'>
				{project.description}
			</p>
		);
	} else {
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
}

export default ProjectAbout;
