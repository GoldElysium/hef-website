import { Submission, SubmissionMedia } from '@/types/payload-types';
import fetchSubmissions from '@/lib/fetchSubmissions';
import { getImageUrl } from '@/components/ui/old/Image';

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

// eslint-disable-next-line max-len
export default async function fetchSubmissionsWithImageProxy(project: { id: string, slug: string }) {
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
