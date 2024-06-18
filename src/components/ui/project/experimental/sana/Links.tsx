import TextHeader from '@/components/ui/project/experimental/sana/TextHeader';
import { Project } from '@/types/payload-types';

export interface ProjectLinksProps {
	links: Exclude<Project['links'], undefined>;
}

export default function ProjectLinks({ links }: ProjectLinksProps) {
	return (
		<div className="mt-4">
			<TextHeader>Links</TextHeader>
			<div className="flex justify-center space-x-6 px-4 sm:px-0">
				{(links ?? []).map((link, index) => (
					<div
						key={`project-link-${index}` /* eslint-disable-line react/no-array-index-key */}
						className="bg-skin-secondary-1 dark:bg-skin-dark-secondary-1 mt-4 flex h-10 w-24 content-end items-center
            justify-center rounded-3xl font-bold text-white
            hover:text-opacity-70"
					>
						<a href={link.url} target="_blank" rel="noreferrer">
							{link.name}
						</a>
					</div>
				))}
			</div>
		</div>
	);
}
