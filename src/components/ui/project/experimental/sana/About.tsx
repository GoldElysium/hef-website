import ProjectDescription from 'components/ui/project/experimental/sana/Description';
import DescriptionSerializer from 'components/ui/project/util/DescriptionSerializer';
import ProjectGallery from 'components/ui/project/Gallery';
import ProjectLinks from 'components/ui/project/experimental/sana/Links';
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
			<p className="my-16 flex content-center justify-center text-center text-3xl text-black dark:text-white dark:text-opacity-80">
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
