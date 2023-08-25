import { Project, Submission } from 'types/payload-types';
import { ArrowLeftIcon } from '@heroicons/react/20/solid';
import Submissions from '../experimental/sana/Submissions';

interface IProps {
	submissions?: Submission[];
	project?: Omit<Project, 'flags' | 'devprops'> & {
		flags: string[];
		devprops: {
			[key: string]: string;
		};
	};
	closeModal: () => void;
}

export default function SubmissionsModal({ project, submissions, closeModal }: IProps) {
	return (
		<div className="z-20 left-0 absolute w-full min-h-screen bg-[#E6F0FF] dark:bg-[#021026]">
			<div className="mx-auto md:max-w-2xl">
				<h1 className="mt-8 mb-4 pb-2 text-[#0869EC] dark:text-[#4C98FF] font-bold text-4xl border-[#0869EC] dark:border-[#4C98FF] border-opacity-30 border-b-2 relative flex items-center justify-center">
					<button
						type="button"
						onClick={closeModal}
						className="absolute left-0 text-lg text-white bg-[#0869EC] dark:bg-[#216FD9] px-4 py-2 rounded-lg flex items-center gap-2"
					>
						<ArrowLeftIcon className="h-6 w-6" />
						Back
					</button>

					Submissions
				</h1>
				<Submissions
					project={project}
					submissions={submissions}
				/>
			</div>
		</div>
	);
}
