import { Project } from '@/types/payload-types';
import dynamic from 'next/dynamic';
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

async function fetchSubmissionsWithImageProxy(project: { id: string, slug: string }) {
	const submissions = await fetchSubmissions(project);

	return submissions.map((submission) => {
		const mediaDocs: ISubmission['media'] = [];

		(submission.media ?? []).forEach((item, index) => {
			if (item.type !== 'image') {
				mediaDocs[index] = item;
				return;
			}

			mediaDocs[index] = {
				...item,
				image: {
					...item.image!,
					url: getImageUrl({
						src: item.image!.url!,
						width: 200,
						height: 200,
						quality: 80,
						action: 'resize',
					}),
				},
			};
		});

		return {
			...submission,
			media: mediaDocs,
		} satisfies ISubmission;
	});
}

export default async function PixiSubmissionWrapper({ project }: IProps) {
	const submissions = await fetchSubmissionsWithImageProxy(project);

	const PixiRejectWrapper = dynamic(() => import('./PixiRejectWrapper'), {
		ssr: false,
	});

	return (
		<PixiRejectWrapper project={project} submissions={submissions} />
	);
}
