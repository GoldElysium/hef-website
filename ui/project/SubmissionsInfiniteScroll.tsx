'use client';

import InfiniteScroll from 'react-infinite-scroll-component';
import TextHeader from 'components/TextHeader';
import Submission from 'ui/project/Submission';
import useSWRInfinite from 'swr/infinite';
import { Fetcher, Key } from 'swr';
import { Project, Submission as ISubmission } from '../../types/payload-types';
import PayloadResponse from '../../types/PayloadResponse';

const SUBMISSIONS_PER_LOAD = 20;

interface IProps {
	project: Omit<Project, 'flags' | 'devprops'> & {
		flags: string[];
		devprops: {
			[key: string]: string;
		};
	};
}

// eslint-disable-next-line max-len
const fetcher: Fetcher<PayloadResponse<ISubmission>, string> = async (url) => {
	const res = await fetch(url);
	const body: PayloadResponse<ISubmission> = await res.json();

	const submissions: ISubmission[] = [];

	// Process submissions
	const tasks = body.docs.map(async (submission) => {
		// Fetch media if needed
		if (submission.srcIcon) {
			const mediaFetch = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL!}/api/submission-media/${submission.srcIcon as string}`);
			// eslint-disable-next-line no-param-reassign
			submission.srcIcon = await mediaFetch.json();
		}

		if (submission.media) {
			const mediaFetch = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL!}/api/submission-media/${submission.media as string}`);
			// eslint-disable-next-line no-param-reassign
			submission.media = await mediaFetch.json();
		}

		submissions.push(submission);
	});
	await Promise.all(tasks);

	return {
		...body,
		docs: submissions,
	};
};

export default function SubmissionsInfiniteScroll({ project }: IProps) {
	const getKey = (pageIndex: number, previousPageData: PayloadResponse<ISubmission>): Key => {
		if (previousPageData && !previousPageData.hasNextPage) return null;
		return `${process.env.NEXT_PUBLIC_CMS_URL!}/api/submissions?where[project][equals]=${project.id}&limit=${SUBMISSIONS_PER_LOAD}&page=${pageIndex}&depth=0`;
	};

	const {
		data, size, setSize, error,
	} = useSWRInfinite(getKey, fetcher);
	if (error) {
		return (
			<p>
				{error}
			</p>
		);
	}
	if (!data) return <p>Loading...</p>;

	const submissions = data.map((res) => res.docs).flat();

	return (
		<div className="mt-4">
			{project?.flags?.includes('disableTabs') && (
				<TextHeader>Submissions</TextHeader>
			)}
			<div className="flex flex-col items-center pt-2">
				<div className="w-full overflow-auto">
					<InfiniteScroll
						dataLength={submissions.length}
						next={() => setSize(size + 1)}
						hasMore={data[0].hasNextPage}
						loader={<p className="text-black dark:text-white text-center mt-4">Loading...</p>}
						scrollThreshold="600px"
					>
						{(!project?.flags?.includes('tiledSubmissions') && (
							<div className="w-full h-full flex justify-center">
								<div
									className={`sm:w-11/12 md:w-10/12 h-full ${project?.flags?.includes('sanaSendoff') ? 'w-full' : ''}`}
								>
									{submissions.map((submission, index) => (
										<Submission
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
									{submissions.map((submission, index) => (
										<div className="min-w-80 w-1/2" key={submission.id}>
											<Submission
												submission={submission as any}
												index={index}
												key={submission.id}
											/>
										</div>
									))}
								</div>
							</div>
						)}
					</InfiniteScroll>
					<p>You have reached the end!</p>
				</div>
			</div>
		</div>
	);
}
