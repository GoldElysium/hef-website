import { Project, Submission, SubmissionMedia } from 'types/payload-types';
import PayloadResponse from 'types/PayloadResponse';
import PhaserWrapper from 'ui/project/guratanabata/PhaserWrapper';
import { getImageUrl } from '../../Image';

interface IProps {
	project: Omit<Project, 'flags' | 'devprops'> & {
		flags: string[];
		devprops: {
			[key: string]: string;
		};
	};
}

export interface TanabataSubmission {
	id: string;
	author: string;
	type: 'text' | 'image' | 'video';
	message?: string;
	media?: {
		full: string;
		thumbnail: string;
		url: string;
	};
	url?: string;
}

async function fetchSubmissions(id: string): Promise<TanabataSubmission[]> {
	// Create an array for all the submissions
	let moreSubmissions = true;
	let page = 1;
	const submissions: Submission[] = [];

	async function fetchNextSubmissions() {
		// Fetch next page
		const submissionsRes = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL!}/api/submissions?where[project][equals]=${id}&limit=100&page=${page}&depth=0`, {
			headers: {
				'X-RateLimit-Bypass': process.env.PAYLOAD_BYPASS_RATE_LIMIT_KEY ?? '',
			} as Record<string, string>,
		});
		const body: PayloadResponse<Submission> = await submissionsRes.json();

		// Process submissions
		const tasks = body.docs.map(async (submission) => {
			// Fetch media if needed
			if (submission.srcIcon) {
				const mediaFetch = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL!}/api/submission-media/${submission.srcIcon as string}`, {
					headers: {
						'X-RateLimit-Bypass': process.env.PAYLOAD_BYPASS_RATE_LIMIT_KEY ?? '',
					} as Record<string, string>,
				});
				// eslint-disable-next-line no-param-reassign
				submission.srcIcon = await mediaFetch.json();
			}

			if (submission.media) {
				const mediaFetch = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL!}/api/submission-media/${submission.media as string}`, {
					headers: {
						'X-RateLimit-Bypass': process.env.PAYLOAD_BYPASS_RATE_LIMIT_KEY ?? '',
					} as Record<string, string>,
				});
				// eslint-disable-next-line no-param-reassign
				submission.media = await mediaFetch.json();
			}

			submissions.push(submission);
		});
		await Promise.all(tasks);

		// Set variables for next fetch
		page += 1;
		moreSubmissions = body.hasNextPage;
	}

	while (moreSubmissions) {
		// eslint-disable-next-line no-await-in-loop
		await fetchNextSubmissions();
	}

	return submissions.map((submission) => {
		if (submission.type !== 'image') return submission as TanabataSubmission;

		return {
			...submission,
			media: {
				full: getImageUrl({
					src: (submission.media as SubmissionMedia).url!, width: 1024,
				}),
				thumbnail: getImageUrl({
					src: (submission.media as SubmissionMedia).url!, width: 400, height: 1280, action: 'smartcrop',
				}),
				url: (submission.media as SubmissionMedia).url!,
			},
		} as TanabataSubmission;
	});
}

export default async function PhaserSubmissionWrapper({ project } : IProps) {
	const submissions = await fetchSubmissions(project.id);

	return (
		<PhaserWrapper
			data={{
				submissions,
			}}
		/>
	);
}
