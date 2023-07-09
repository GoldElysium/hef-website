import { Project } from 'types/payload-types';
import dynamic from 'next/dynamic';

interface IProps {
	project: Omit<Project, 'flags' | 'devprops'> & {
		flags: string[];
		devprops: {
			[key: string]: string;
		};
	};
}

async function fetchSubmissions() {
	const totalResponses = 648;
	const responsesPerCall = 100;
	const numCalls = Math.ceil(totalResponses / responsesPerCall);
	const allResponses: any[] = [];

	// TODO: This is dummy data, load data from CMS in prod
	for (let i = 0; i < numCalls; i++) {
		let paras = responsesPerCall;
		if (i === numCalls - 1) {
			paras = totalResponses - (responsesPerCall * i);
		}

		// eslint-disable-next-line no-await-in-loop
		const res = await fetch(`https://baconipsum.com/api/?type=all-meat&paras=${paras}&start-with-lorem=1`);
		// eslint-disable-next-line no-await-in-loop
		allResponses.push(...(await res.json()));
	}

	return allResponses;
}

export default async function PixiSubmissionWrapper({ project }: IProps) {
	const submissions = await fetchSubmissions();

	const PixiWrapper = dynamic(() => import('./PixiWrapper'), {
		ssr: false,
	});

	return (
		<PixiWrapper project={project} submissions={submissions} />
	);
}
