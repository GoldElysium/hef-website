'use client';

import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { ReactNode, useEffect, useState } from 'react';
import { Submission as ISubmission, SubmissionMedia } from '@/types/payload-types';

interface IProps {
	submission: Omit<ISubmission, 'media' | 'srcIcon'> & { media: Array<NonNullable<Required<ISubmission>['media']>[number] & { image: SubmissionMedia }>; srcIcon: SubmissionMedia };
	elements: ReactNode[];
}

export default function SubmissionGallery({ submission, elements }: IProps) {
	const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

	useEffect(() => {
		setCurrentMediaIndex(0);
	}, [submission, elements]);

	return (
		<div className="mt-4">
			<div className="flex flex-col items-center pt-2">
				<div className="mb-2 mt-4 flex size-full max-h-[750px] justify-center">
					{elements[currentMediaIndex]}
				</div>
				<div className="mt-2 flex items-center justify-center text-center font-bold">
					<ChevronLeftIcon
						className={
							currentMediaIndex > 0
								? 'size-8 cursor-pointer text-black dark:text-white'
								: 'dark:text-skin-dark-primary size-8 text-skin-primary text-opacity-30 dark:text-opacity-30'
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
								? 'size-8 cursor-pointer text-black dark:text-white'
								: 'dark:text-skin-dark-primary size-8 text-skin-primary text-opacity-30 dark:text-opacity-30'
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
