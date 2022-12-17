import ProjectDescription from 'ui/project/experimental/Description';
import DescriptionSerializer from 'ui/DescriptionSerializer';
import ProjectGallery from 'ui/project/Gallery';
import ProjectLinks from 'ui/project/experimental/Links';
import { Project } from 'types/payload-types';

export interface ProjectAboutProps {
	project: Omit<Project, 'flags' | 'devprops'> & {
		flags: string[];
		devprops: {
			[key: string]: string;
		};
	};
}

export default function ProjectAbout({ project }: ProjectAboutProps) {
	if (project.flags?.includes('bigAbout')) {
		return (
			<p className="flex justify-center content-center text-black dark:text-white dark:text-opacity-80 text-3xl text-center my-16">
				{DescriptionSerializer(project.description)}
			</p>
		);
	}
	return (
		<>
			<ProjectDescription description={project.description} />
			{(project.media?.length ?? 0) > 0 && (
				<ProjectGallery project={project as any} />
			)}
			{(project.media?.length ?? 0) > 0 && (
				<ProjectLinks links={project.links!} />
			)}
		</>
	);
}
