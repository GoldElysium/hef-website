import { Project } from '@/types/payload-types';
import dynamic from 'next/dynamic';
import fetchSubmissionsWithImageProxy from '@/lib/fetchSubmissionsWithImageProxy';
import { MarkerMap } from '@/components/ui/project/kroniimap/KroniiMap';

interface IProps {
	project: Omit<Project, 'flags' | 'devprops'> & {
		flags: string[];
		devprops: {
			[key: string]: string;
		};
	};
}

export default async function KroniiMapSubmissionWrapper({ project }: IProps) {
	const submissions = await fetchSubmissionsWithImageProxy(project);

	const parsedSubmissions = submissions.map((submission) => {
		if (!submission.devprops) throw new Error(`Invalid submission found: ${submission.id}`);
		const markerPosProp = submission.devprops.find((prop) => prop.key === 'markerPos');
		if (!markerPosProp) throw new Error(`Invalid submission found: ${submission.id}`);

		const markerPos = JSON.parse(markerPosProp.value) as [number, number];

		return {
			...submission,
			marker: markerPos,
			markerId: markerPos.join(';'),
		};
	});

	const markerMap: MarkerMap = {};

	parsedSubmissions.forEach((submission) => {
		if (!markerMap[submission.markerId]) {
			markerMap[submission.markerId] = {
				id: submission.markerId,
				pos: submission.marker,
				submissions: [submission.id],
			};
		} else {
			markerMap[submission.markerId].submissions.push(submission.id);
		}
	});

	const KroniiMap = dynamic(() => import('./KroniiMap'), {
		ssr: false,
	});

	return (
		<KroniiMap project={project} submissions={submissions} markerMap={markerMap} />
	);
}
