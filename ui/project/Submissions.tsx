import Submission from 'ui/project/Submission';
import { Project, Submission as ISubmission } from 'types/payload-types';
import PayloadResponse from 'types/PayloadResponse';

interface IProps {
	project: Omit<Project, 'flags' | 'devprops'> & {
		flags: string[];
		devprops: {
			[key: string]: string;
		};
	};
}

async function fetchSubmissions(project: { id: string }) {
	// Create an array for all the submissions
	let moreSubmissions = true;
	let page = 1;
	const submissions: ISubmission[] = [];

	async function fetchNextSubmissions() {
		// Fetch next page
		const submissionsRes = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL!}/api/submissions?where[project][equals]=${project.id}&limit=100&page=${page}&depth=0`, {
			headers: {
				'X-RateLimit-Bypass': process.env.PAYLOAD_BYPASS_RATE_LIMIT_KEY ?? '',
			} as Record<string, string>,
		});
		const body: PayloadResponse<ISubmission> = await submissionsRes.json();

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

			const mediaDocs: ISubmission['media'] = [];
			await Promise.all(submission.media.map(async (item) => {
				if (item.type !== 'image') {
					mediaDocs.push(item);
					return;
				}

				const mediaFetch = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL!}/api/submission-media/${item.image as string}`, {
					headers: {
						'X-RateLimit-Bypass': process.env.PAYLOAD_BYPASS_RATE_LIMIT_KEY ?? '',
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

	return submissions;
}

export default async function Submissions({ project }: IProps) {
	const submissions = await fetchSubmissions(project);

	return (
		<div className="flex flex-col items-center pt-2">
			<div className="w-full max-w-full overflow-auto">
				{
					!project?.flags?.includes('tiledSubmissions')
						? (
							<div className="w-full h-full flex justify-center">
								<div
									className={`sm:w-11/12 md:w-10/12 h-full ${project?.flags?.includes('sanaSendoff') ? 'w-full' : 'max-w-full'}`}
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
						)
						: (
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
						)
				}
				<p>You have reached the end!</p>
			</div>
		</div>
	);
}
