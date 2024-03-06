'use client';

import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import TextHeader from '@/components/ui/old/TextHeader';
import GalleryItem from '@/components/ui/project/GalleryItem';
import { useState } from 'react';
import { Media, Project } from '@/types/payload-types';

interface IProps {
	project: Omit<Project, 'flags' | 'devprops' | 'media'> & {
		flags: string[];
		devprops: {
			[key: string]: string;
		};
		media: Array<Omit<NonNullable<Required<Project>['media']>[number], 'media'> & { media: Media }>
	};
}
export default function Gallery({ project }: IProps) {
	const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

	return (
		<div className="mt-4">
			<TextHeader>Gallery</TextHeader>
			<div className="flex flex-col items-center pt-2">
				<div className="h-52 w-full sm:h-96 sm:w-8/12">
					<GalleryItem media={project.media} index={currentMediaIndex} />
				</div>
				<div className="mt-2 flex items-center justify-center text-center font-bold">
					<ChevronLeftIcon
						className={
							currentMediaIndex > 0
								? 'size-8 cursor-pointer text-black dark:text-white'
								: 'text-skin-primary-1 dark:text-skin-dark-primary-1 size-8 text-opacity-30 dark:text-opacity-30'
						}
						onClick={() => {
							if (currentMediaIndex > 0) {
								setCurrentMediaIndex(currentMediaIndex - 1);
							}
						}}
					/>
					<span className="text-black dark:text-white">
						{currentMediaIndex + 1}
						/
						{project.media ? project.media.length : 0}
					</span>
					<ChevronRightIcon
						className={
							currentMediaIndex + 1
							< (project.media ? project.media.length : 0)
								? 'size-8 cursor-pointer text-black dark:text-white'
								: 'text-skin-primary-1 dark:text-skin-dark-primary-1 size-8 text-opacity-30 dark:text-opacity-30'
						}
						onClick={() => {
							if (
								currentMediaIndex + 1
								< (project.media ? project.media.length : 0)
							) { setCurrentMediaIndex(currentMediaIndex + 1); }
						}}
					/>
				</div>
			</div>
		</div>
	);
}
