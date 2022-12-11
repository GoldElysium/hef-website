'use client';

import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import TextHeader from 'components/TextHeader';
import GalleryItem from 'ui/project/GalleryItem';
import { useState } from 'react';
import { Project } from '../../types/payload-types';

interface IProps {
	project: Omit<Project, 'flags' | 'devprops'> & {
		flags: string[];
		devprops: {
			[key: string]: string;
		};
	};
}
export default function Gallery({ project }: IProps) {
	const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

	return (
		<div className="mt-4">
			<TextHeader>Gallery</TextHeader>
			<div className="flex flex-col items-center pt-2">
				<div className="w-full h-52 sm:w-8/12 sm:h-96">
					<GalleryItem media={project.media} index={currentMediaIndex} />
				</div>
				<div className="flex mt-2 font-bold items-center justify-center text-center">
					<ChevronLeftIcon
						className={
							currentMediaIndex > 0
								? 'h-8 w-8 cursor-pointer text-black dark:text-white'
								: 'h-8 w-8 text-skin-primary-1 text-opacity-30 dark:text-skin-dark-primary-1 dark:text-opacity-30'
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
								? 'h-8 w-8 cursor-pointer text-black dark:text-white'
								: 'h-8 w-8 text-skin-primary-1 text-opacity-30 dark:text-skin-dark-primary-1 dark:text-opacity-30'
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
