'use client';

import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import TextHeader from 'ui/project/experimental/TextHeader';
import {
	Project, Submission as ISubmission, Submission, SubmissionMedia,
} from 'types/payload-types';
import ReactPlayer from 'react-player';
import Image from 'next/image';
import SubmissionGallery from '../SubmissionGallery';

interface ISubmissionProps {
	project?: Omit<Project, 'flags' | 'devprops'> & {
		flags: string[];
		devprops: {
			[key: string]: string;
		};
	};
	submission: Omit<ISubmission, 'media' | 'srcIcon'> & { media: Array<ISubmission['media'][number] & { image: SubmissionMedia }>; srcIcon: SubmissionMedia };
	index: number;
}

function SubmissionElement({ project, submission, index }: ISubmissionProps) {
	return (
		<div className="w-full max-h-full text-black dark:text-white" key={submission.id}>
			<div className="w-full flex mt-4 h-14">
				{submission.srcIcon && (
					<Image
						className="object-cover w-14 h-14 rounded-full"
						src={submission.srcIcon.url!}
						width={
							submission.srcIcon.width! < 56 ? submission.srcIcon.width : 56
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
					<div className="text-lg mt-3 ml-4">
						From:
						{' '}
						<span className="font-bold">{submission.author}</span>
					</div>
				)}
				<div className="flex-grow" />
				<p className="text-xl mt-3 mr-4">{`#${index + 1}`}</p>
			</div>
			<div className="w-full mt-3">
				{
					submission.media.length === 1 && (
						<>
							{submission.media[0].type === 'video' && (
								<div className="mb-4 w-full h-[300px] flex justify-center">
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
								<div className="mt-4 mb-2 w-full h-full max-h-[750px] flex justify-center">
									<Image
										className="max-w-10/12 object-contain mb-4"
										src={submission.media[0].image.url!}
										width={
											submission.media[0].image.width! < 1024
												? submission.media[0].image.width : 1024
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
						<SubmissionGallery submission={submission} />
					)
				}
				{submission.message && (
					<p className={`mx-4 mb-4 w-auto h-full overflow-auto whitespace-pre-line dark:text-gray-300 ${project?.flags?.includes('sanaSendoff') ? 'sana-message' : ''}`}>
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
						loader={<p className="text-black dark:text-white text-center mt-4">Loading...</p>}
						scrollThreshold="600px"
					>
						{(!project?.flags?.includes('tiledSubmissions') && (
							<div className="w-full h-full flex justify-center">
								<div
									className={`sm:w-11/12 md:w-10/12 h-full ${project?.flags?.includes('sanaSendoff') ? 'w-full' : ''}`}
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
							<div className="w-full h-full flex flex-wrap justify-center content-center">
								<div className="sm:w-11/12 md:w-10/12 flex flex-wrap">
									{shownSubmissions.map((submission, index) => (
										<div className="min-w-80 w-1/2" key={submission.id}>
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
