import Submission from 'ui/project/Submission';
import { Project, Submission as ISubmission } from 'types/payload-types';
import PayloadResponse from 'types/PayloadResponse';
import useTranslation from 'lib/i18n/server';
import { Language } from 'lib/i18n/languages';
import SubmissionsWithFilter from './experimental/submissionsFilter/SubmissionsWithFilter';

interface IProps {
	project: Omit<Project, 'flags' | 'devprops'> & {
		flags: string[];
		devprops: {
			[key: string]: string;
		};
	};
	lang: Language;
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
				'X-RateLimit-Bypass': process.env.PAYLOAD_BYPASS_RATE_LIMIT_KEY ?? undefined,
				Authorization: process.env.PAYLOAD_API_KEY ? `users API-Key ${process.env.PAYLOAD_API_KEY}` : undefined,
			} as Record<string, string>,
		});
		const body: PayloadResponse<ISubmission> = await submissionsRes.json();

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
			await Promise.all(submission.media!.map(async (item, index) => {
				if (item.type !== 'image') {
					mediaDocs[index] = item;
					return;
				}

				const mediaFetch = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL!}/api/submission-media/${item.image as string}`, {
					headers: {
						'X-RateLimit-Bypass': process.env.PAYLOAD_BYPASS_RATE_LIMIT_KEY ?? undefined,
						Authorization: process.env.PAYLOAD_API_KEY ? `users API-Key ${process.env.PAYLOAD_API_KEY}` : undefined,
					} as Record<string, string>,
				});
				mediaDocs[index] = {
					...item,
					image: await mediaFetch.json(),
				};
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

export default async function Submissions({ project, lang }: IProps) {
	const submissions = await fetchSubmissions(project);
	const { t } = await useTranslation(lang, 'project', 'submissions');

	if (project.flags.includes('tiledSubmissions')) {
		return (
			<div className="flex flex-col items-center pt-2">
				<div className="w-full max-w-full overflow-auto">
					<div className="w-full h-full flex flex-wrap justify-center content-center">
						<div className="sm:w-11/12 md:w-10/12 flex flex-wrap">
							{submissions.map((submission, index) => (
								<div className="min-w-80 w-1/2" key={submission.id}>
									<Submission
										submission={submission as any}
										index={index}
										key={submission.id}
										lang={lang}
									/>
								</div>
							))}
						</div>
					</div>
					<p>{t('end')}</p>
				</div>
			</div>
		);
	}

	if (project.flags.includes('filterableSubmissions')) {
		const filterOptions: { [key: string]: string[] } = {};

		/* eslint-disable no-restricted-syntax */
		for (const submission of submissions) {
			for (const attribute of submission.filterableAttributes!) {
				if (!filterOptions[attribute.name]) filterOptions[attribute.name] = [];

				for (const value of attribute.values!) {
					if (!filterOptions[attribute.name].includes(value.value)) {
						filterOptions[attribute.name].push(value.value);
					}
				}
			}
		}

		for (const key in filterOptions) {
			if (Object.hasOwnProperty.call(filterOptions, key)) {
				filterOptions[key].sort((a, b) => a.localeCompare(b));
			}
		}
		/* eslint-enable */

		return (
			<SubmissionsWithFilter
				submissions={submissions.map((submission) => ({
					data: submission,
					el: <Submission
						submission={submission as any}
						key={submission.id}
						lang={lang}
					/>,
				}))}
				filterOptions={filterOptions}
			/>
		);
	}

	return (
		<div className="flex flex-col items-center pt-2">
			<div className="w-full max-w-full overflow-auto">
				<div className="w-full h-full flex justify-center">
					<div
						className={`sm:w-11/12 md:w-10/12 h-full ${project.flags.includes('sanaSendoff') ? 'w-full' : 'max-w-full'}`}
					>
						{submissions.map((submission, index) => (
							<Submission
								submission={submission as any}
								index={index}
								key={submission.id}
								lang={lang}
							/>
						))}
					</div>
				</div>
				<p>{t('end')}</p>
			</div>
		</div>
	);
}
