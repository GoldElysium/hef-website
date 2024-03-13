import { Project, SubmissionMedia } from '@/types/payload-types';
import dynamic from 'next/dynamic';
import { MarkerMap } from '@/components/ui/project/kroniimap/KroniiMap';
import fetchSubmissions, { ISubmission } from '@/lib/fetchSubmissions';
import { getImageUrl } from '@/components/ui/old/Image';

interface IProps {
	project: Omit<Project, 'flags' | 'devprops'> & {
		flags: string[];
		devprops: {
			[key: string]: string;
		};
	};
}

type Submission = Omit<ISubmission, 'media' | 'srcIcon'> & { media: Array<NonNullable<Required<ISubmission>['media']>[number] & { image: SubmissionMedia }>; srcIcon: SubmissionMedia };

async function fetchSubmissionsWithImageProxy(project: { id: string, slug: string }) {
	const submissions = await fetchSubmissions(project);

	return submissions.map((submission) => {
		const mediaDocs: Submission['media'] = [];

		(submission.media ?? []).forEach((item, index) => {
			if (item.type !== 'image') {
				mediaDocs[index] = item as any;
				return;
			}

			mediaDocs[index] = {
				...item,
				image: {
					...item.image!,
					url: getImageUrl({
						src: item.image!.url!,
						width: 1280,
						height: 720,
						quality: 80,
						action: 'resize',
					}),
				},
			};
		});

		return {
			...submission,
			media: mediaDocs,
		} as Submission;
	});
}

export default async function KroniiMapSubmissionWrapper({ project }: IProps) {
	const submissions = await fetchSubmissionsWithImageProxy(project);

	const parsedSubmissions = submissions.map((submission) => {
		if (!submission.devprops) throw new Error(`Invalid submission found: ${submission.id}`);
		const markerPosProp = submission.devprops.find((prop) => prop.key === 'markerPos');
		if (!markerPosProp) throw new Error(`Invalid submission found: ${submission.id}`);

		return {
			...submission,
			markerId: markerPosProp.value,
		};
	});

	const markerMap: MarkerMap = {};

	parsedSubmissions.forEach((submission) => {
		if (!markerMap[submission.markerId]) {
			const posSplit = submission.markerId.split(';');

			markerMap[submission.markerId] = {
				id: submission.markerId,
				pos: [Number.parseFloat(posSplit[0]), Number.parseFloat(posSplit[1])],
				submissions: [submission.id],
			};
		} else {
			markerMap[submission.markerId].submissions.push(submission.id);
		}
	});

	const descriptionWithProxy = project.description.map((node) => {
		if (node.type !== 'upload') return node;
		// @ts-ignore
		return {
			...node,
			value: {
				...node.value as any,
				url: getImageUrl({
					src: (node.value as any).url,
					width: 1920,
					height: 1080,
					quality: 80,
					action: 'resize',
				}),
			},
		};
	});

	const Tabs = dynamic(() => import('./Tabs'), {
		ssr: false,
	});

	return (
		<Tabs
			project={{ ...project, description: descriptionWithProxy }}
			submissions={submissions}
			markerMap={markerMap}
		/>
	);
}
