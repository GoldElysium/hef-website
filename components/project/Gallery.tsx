import React from 'react';
import ReactPlayer from 'react-player';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline';
import TextHeader from '../TextHeader';
import { IMedia } from '../../models/Project';

interface GalleryProps {
	media: IMedia,
}

const CurrentGalleryItem = ({ media }: GalleryProps) => {
	if (media.type === 'video') {
		return (
			<ReactPlayer
				width="100%"
				height="100%"
				url={media.src}
				controls
				light
			/>
		);
	}
	if (media.type === 'image') {
		return <img className="max-w-full max-h-full object-contain" src={media.src} alt="" loading="lazy" />;
	}
	return <p>Invalid media</p>;
};

interface IProps {
	media: IMedia[] | undefined
}

const Gallery = ({ media }: IProps) => {
	const [currentMediaIndex, setCurrentMediaIndex] = React.useState(0);

	if (!media || media.length === 0) return <></>;

	return (
		<div className="mt-4">
			<TextHeader text="Gallery" />
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
						{media.length}
					</span>
					<ChevronRightIcon
						className={
							currentMediaIndex + 1
							< (media.length)
								? 'h-8 w-8 cursor-pointer text-black dark:text-white'
								: 'h-8 w-8 text-skin-primary-1 text-opacity-30 dark:text-skin-dark-primary-1 dark:text-opacity-30'
						}
						onClick={() => {
							if (currentMediaIndex + 1 < media.length) {
								setCurrentMediaIndex(currentMediaIndex + 1);
							}
						}}
					/>
				</div>
			</div>
		</div>
	);
};

export default Gallery;
