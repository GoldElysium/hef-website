'use client';

import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { Submission as ISubmission, SubmissionMedia } from 'types/payload-types';
import ReactPlayer from 'react-player';
import Image from 'next/image';

interface IProps {
	submission: Omit<ISubmission, 'media' | 'srcIcon'> & { media: Array<ISubmission['media'][number] & { image: SubmissionMedia }>; srcIcon: SubmissionMedia };
}

function GalleryItem({ media, index }: { media: IProps['submission']['media'], index: number }) {
	if (media[index].type === 'video') {
		return (
			<ReactPlayer
				width="100%"
				height="100%"
				key={media[index].id!}
				url={media[index].url!}
				controls
				light
			/>
		);
	}
	if (media[index].type === 'image') {
		return (
			<Image
				className="max-w-10/12 object-contain mb-4"
				key={media[index].id!}
				src={media[index].image.url!}
				width={
					media[index].image.width! < 1024 ? media[index].image.width : 1024
				}
				height={
					media[index].image.width! < 1024
						? media[index].image.height!
						: (media[index].image.height! / media[index].image.width!) * 1024
				}
				alt=""
			/>
		);
	}

	return <p>Invalid media</p>;
}
export default function SubmissionGallery({ submission }: IProps) {
	const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

	return (
		<div className="mt-4">
			<div className="flex flex-col items-center pt-2">
				<div className="mt-4 mb-2 w-full h-full max-h-[750px] flex justify-center">
					<GalleryItem media={submission.media} index={currentMediaIndex} />
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
						{submission.media.length}
					</span>
					<ChevronRightIcon
						className={
							currentMediaIndex + 1 < submission.media.length
								? 'h-8 w-8 cursor-pointer text-black dark:text-white'
								: 'h-8 w-8 text-skin-primary-1 text-opacity-30 dark:text-skin-dark-primary-1 dark:text-opacity-30'
						}
						onClick={() => {
							if (
								currentMediaIndex + 1 < submission.media.length
							) { setCurrentMediaIndex(currentMediaIndex + 1); }
						}}
					/>
				</div>
			</div>
		</div>
	);
}
