'use client';

import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { ReactNode, useState } from 'react';
import { Submission as ISubmission, SubmissionMedia } from 'types/payload-types';

interface IProps {
	submission: Omit<ISubmission, 'media' | 'srcIcon'> & { media: Array<Required<ISubmission>['media'][number] & { image: SubmissionMedia }>; srcIcon: SubmissionMedia };
	elements: ReactNode[];
}

export default function SubmissionGallery({ submission, elements }: IProps) {
	const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

	return (
		<div className="mt-4">
			<div className="flex flex-col items-center pt-2">
				<div className="mb-2 mt-4 flex h-full max-h-[750px] w-full justify-center">
					{elements[currentMediaIndex]}
				</div>
				<div className="mt-2 flex items-center justify-center text-center font-bold">
					<ChevronLeftIcon
						className={
							currentMediaIndex > 0
								? 'h-8 w-8 cursor-pointer text-black dark:text-white'
								: 'text-skin-primary-1 dark:text-skin-dark-primary-1 h-8 w-8 text-opacity-30 dark:text-opacity-30'
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
								: 'text-skin-primary-1 dark:text-skin-dark-primary-1 h-8 w-8 text-opacity-30 dark:text-opacity-30'
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
