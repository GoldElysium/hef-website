import {
	Project, Submission as ISubmission, Submission, SubmissionMedia,
} from '@/types/payload-types';
import PayloadResponse from '@/types/PayloadResponse';
// eslint-disable-next-line import/no-cycle
import PhaserWrapper from '@/components/ui/project/guratanabata/PhaserWrapper';
import { getImageUrl } from '@/components/ui/old/Image';

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
				'X-RateLimit-Bypass': process.env.PAYLOAD_BYPASS_RATE_LIMIT_KEY ?? undefined,
				Authorization: process.env.PAYLOAD_API_KEY ? `users API-Key ${process.env.PAYLOAD_API_KEY}` : undefined,
			} as Record<string, string>,
		});
		const body: PayloadResponse<Submission> = await submissionsRes.json();

		// Process submissions
		const tasks = body.docs.map(async (submission) => {
			// Fetch media if needed
			if (submission.srcIcon) {
				const mediaFetch = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL!}/api/submission-media/${submission.srcIcon as string}`, {
					headers: {
						'X-RateLimit-Bypass': process.env.PAYLOAD_BYPASS_RATE_LIMIT_KEY ?? undefined,
						Authorization: process.env.PAYLOAD_API_KEY ? `users API-Key ${process.env.PAYLOAD_API_KEY}` : undefined,
					} as Record<string, string>,
				});
				// eslint-disable-next-line no-param-reassign
				submission.srcIcon = await mediaFetch.json();
			}

			const mediaDocs: ISubmission['media'] = [];
			await Promise.all(submission.media!.map(async (item) => {
				if (item.type !== 'image') {
					mediaDocs.push(item);
					return;
				}

				const mediaFetch = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL!}/api/submission-media/${item.image as string}`, {
					headers: {
						'X-RateLimit-Bypass': process.env.PAYLOAD_BYPASS_RATE_LIMIT_KEY ?? undefined,
						Authorization: process.env.PAYLOAD_API_KEY ? `users API-Key ${process.env.PAYLOAD_API_KEY}` : undefined,
					} as Record<string, string>,
				});
				mediaDocs.push({
					...item,
					image: await mediaFetch.json(),
				});
			}));

			// eslint-disable-next-line no-param-reassign
			submission.media = mediaDocs;

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
		if (submission.media!.length === 0) {
			return {
				...submission,
				media: undefined,
				type: 'text',
			} satisfies TanabataSubmission;
		}

		return {
			...submission,
			type: 'image',
			media: {
				full: getImageUrl({
					src: (submission.media![0].image as SubmissionMedia).url!, width: 1024,
				}),
				thumbnail: getImageUrl({
					src: (submission.media![0].image as SubmissionMedia).url!, width: 400, height: 1280, action: 'smartcrop',
				}),
				url: (submission.media![0].image as SubmissionMedia).url!,
			},
		} satisfies TanabataSubmission;
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
