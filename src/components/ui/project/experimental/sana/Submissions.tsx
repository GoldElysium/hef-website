'use client';

import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import TextHeader from '@/components/ui/project/experimental/sana/TextHeader';
import {
	Project, Submission as ISubmission, Submission, SubmissionMedia,
} from '@/types/payload-types';
import ReactPlayer from 'react-player';
import Image from 'next/image';
import SubmissionGallery from '../../SubmissionGallery';

interface ISubmissionProps {
	project?: Omit<Project, 'flags' | 'devprops'> & {
		flags: string[];
		devprops: {
			[key: string]: string;
		};
	};
	submission: Omit<ISubmission, 'media' | 'srcIcon'> & { media: Array<NonNullable<Required<ISubmission>['media']>[number] & { image: SubmissionMedia }>; srcIcon: SubmissionMedia };
	index: number;
}

function SubmissionElement({ project, submission, index }: ISubmissionProps) {
	return (
		<div className="max-h-full w-full text-black dark:text-white" key={submission.id}>
			<div className="mt-4 flex h-14 w-full">
				{submission.srcIcon && (
					<Image
						className="size-14 rounded-full object-cover"
						src={submission.srcIcon.url!}
						width={
							submission.srcIcon.width! < 56 ? submission.srcIcon.width! : 56
						}
						height={
							submission.srcIcon.width! < 56
								? submission.srcIcon.height!
								: (submission.srcIcon.height! / submission.srcIcon.width!) * 56
						}
						alt={`Profile picture of ${submission.author}`}
					/>
				)}
				{submission.author && (
					<div className="ml-4 mt-3 text-lg">
						From:
						{' '}
						<span className="font-bold">{submission.author}</span>
					</div>
				)}
				<div className="grow" />
				<p className="mr-4 mt-3 text-xl">{`#${index + 1}`}</p>
			</div>
			<div className="mt-3 w-full">
				{
					submission.media.length === 1 && (
						<>
							{submission.media[0].type === 'video' && (
								<div className="mb-4 flex h-[300px] w-full justify-center">
									<ReactPlayer
										width="83%"
										height="300px"
										url={submission.media[0].url!}
										controls
										light
									/>
								</div>
							)}
							{submission.media[0].type === 'image' && (
								<div className="mb-2 mt-4 flex size-full max-h-[750px] justify-center">
									<Image
										className="mb-4 max-w-10/12 object-contain"
										src={submission.media[0].image.url!}
										width={
											submission.media[0].image.width! < 1024
												? submission.media[0].image.width! : 1024
										}
										height={
											submission.media[0].image.width! < 1024
												? submission.media[0].image.height!
												// eslint-disable-next-line max-len
												: (submission.media[0].image.height! / submission.media[0].image.width!) * 1024
										}
										alt={`Image submission from ${submission.author}`}
									/>
								</div>
							)}
						</>
					)
				}
				{
					submission.media.length > 1 && (
						<SubmissionGallery
							submission={submission}
							elements={submission.media.map((media, submissionIndex) => {
								if (media.type === 'video') {
									return (
										<ReactPlayer
											width="100%"
											height="100%"
											key={media.id!}
											url={media.url!}
											controls
											light
										/>
									);
								}
								if (media.type === 'image') {
									return (
										<Image
											className="mb-4 max-w-10/12 object-contain"
											key={media.id!}
											src={media.image.url!}
											width={
												media.image.width! < 1024 ? media.image.width! : 1024
											}
											height={
												media.image.width! < 1024
													? media.image.height!
													: (media.image.height! / media.image.width!) * 1024
											}
											alt=""
											loading={submissionIndex > 0 ? 'eager' : 'lazy'}
										/>
									);
								}

								return <p key={media.id}>Invalid media</p>;
							})}
						/>
					)
				}
				{submission.message && (
					<p className={`mx-4 mb-4 h-full w-auto overflow-auto whitespace-pre-line dark:text-gray-300 ${project?.flags?.includes('sanaSendoff') ? 'sana-message' : ''}`}>
						<span className="relative">{submission.message}</span>
					</p>
				)}
				{!project?.flags?.includes('tiledSubmissions') && (
					<hr className="border-t-1 border-dashed border-gray-400" />
				)}
			</div>
		</div>
	);
}

interface IProps {
	submissions?: Submission[];
	project?: Omit<Project, 'flags' | 'devprops'> & {
		flags: string[];
		devprops: {
			[key: string]: string;
		};
	};
}

const SUBMISSIONS_PER_LOAD = 10;

function Submissions({ submissions, project }: IProps) {
	const [showLimit, setShowLimit] = React.useState(SUBMISSIONS_PER_LOAD);
	if (!submissions || submissions.length === 0) return null;

	const shownSubmissions = submissions.slice(0, showLimit);
	const hasMore = showLimit < submissions.length;
	const showMore = () => {
		setShowLimit(showLimit + SUBMISSIONS_PER_LOAD);
	};

	return (
		<div className="mt-4">
			{project?.flags?.includes('disableTabs') && (
				<TextHeader>Submissions</TextHeader>
			)}
			<div className="flex flex-col items-center pt-2">
				<div className="w-full overflow-auto">
					<InfiniteScroll
						dataLength={shownSubmissions.length}
						next={showMore}
						hasMore={hasMore}
						loader={<p className="mt-4 text-center text-black dark:text-white">Loading...</p>}
						scrollThreshold="600px"
					>
						{(!project?.flags?.includes('tiledSubmissions') && (
							<div className="flex size-full justify-center">
								<div
									className={`h-full sm:w-11/12 md:w-10/12 ${project?.flags?.includes('sanaSendoff') ? 'w-full' : ''}`}
								>
									{shownSubmissions.map((submission, index) => (
										<SubmissionElement
											project={project}
											submission={submission as any}
											index={index}
											key={submission.id}
										/>
									))}
								</div>
							</div>
						)) || (
							<div className="flex size-full flex-wrap content-center justify-center">
								<div className="flex flex-wrap sm:w-11/12 md:w-10/12">
									{shownSubmissions.map((submission, index) => (
										<div className="w-1/2 min-w-80" key={submission.id}>
											<SubmissionElement
												project={project}
												submission={submission as any}
												index={index}
											/>
										</div>
									))}
								</div>
							</div>
						)}
					</InfiniteScroll>
				</div>
			</div>
		</div>
	);
}

export default Submissions;
