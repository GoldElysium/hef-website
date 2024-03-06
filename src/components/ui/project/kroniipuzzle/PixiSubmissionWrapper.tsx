import { Project } from '@/types/payload-types';
import dynamic from 'next/dynamic';
import fetchSubmissionsWithImageProxy from '@/lib/fetchSubmissionsWithImageProxy';

interface IProps {
	project: Omit<Project, 'flags' | 'devprops'> & {
		flags: string[];
		devprops: {
			[key: string]: string;
		};
	};
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
