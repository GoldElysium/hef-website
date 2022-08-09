import ReactPlayer from 'react-player';
import { Media, Project } from '../../types/payload-types';
import TextHeader from '../TextHeader';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline';
import { useState } from 'react';

function CurrentGalleryItem({ media }: { media: Exclude<Project['media'], undefined>[number] }) {
	if (media.type === 'video') {
		return (
			<ReactPlayer
				width="100%"
				height="100%"
				url={media.url!}
				controls
				light
			/>
		);
	}
	if (media.type === 'image') {
		return <img className="max-w-full max-h-full object-contain" src={(media.media! as Media).sizes!.thumbnail!.url!} alt="" loading="lazy" />;
	}
	return <p>Invalid media</p>;
}

export default function Gallery({ media }: { media: Exclude<Project['media'], undefined> }) {
	const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

	return (
		<div className="mt-4">
			<TextHeader>Gallery</TextHeader>
			<div className="flex flex-col items-center pt-2">
				<div className="w-full h-52 sm:w-8/12 sm:h-96">
					<CurrentGalleryItem media={media[currentMediaIndex]} />
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
						{media ? media.length : 0}
					</span>
					<ChevronRightIcon
						className={
							currentMediaIndex + 1
							< (media ? media.length : 0)
								? 'h-8 w-8 cursor-pointer text-black dark:text-white'
								: 'h-8 w-8 text-skin-primary-1 text-opacity-30 dark:text-skin-dark-primary-1 dark:text-opacity-30'
						}
						onClick={() => {
							if (
								currentMediaIndex + 1
								< (media ? media.length : 0)
							) { setCurrentMediaIndex(currentMediaIndex + 1); }
						}}
					/>
				</div>
			</div>
		</div>
	);
}
