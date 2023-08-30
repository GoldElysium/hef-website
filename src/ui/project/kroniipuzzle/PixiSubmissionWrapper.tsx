import { Project, Submission, SubmissionMedia } from 'types/payload-types';
import dynamic from 'next/dynamic';
import fetchSubmissions from 'lib/fetchSubmissions';
import { getImageUrl } from 'ui/Image';

interface IProps {
	project: Omit<Project, 'flags' | 'devprops'> & {
		flags: string[];
		devprops: {
			[key: string]: string;
		};
	};
}

interface MediaItem {
	type: 'image' | 'video';
	subtype?: 'artwork' | 'picture' | 'other';
	image?: SubmissionMedia;
	url?: string;
	id?: string;
}

interface ISubmission extends Submission {
	media?: MediaItem[];
}

async function fetchSubmissionsWithProxy(project: { id: string, slug: string }) {
	const submissions = await fetchSubmissions(project);

	return submissions.map((submission) => {
		const mediaDocs: ISubmission['media'] = [];
		(submission.media ?? []).map(async (item, index) => {
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
		};
	});
}
export default async function PixiSubmissionWrapper({ project }: IProps) {
	const submissions = await fetchSubmissionsWithProxy(project);

	const PixiRejectWrapper = dynamic(() => import('./PixiRejectWrapper'), {
		ssr: false,
	});

	return (
		<PixiRejectWrapper project={project} submissions={submissions} />
	);
}
