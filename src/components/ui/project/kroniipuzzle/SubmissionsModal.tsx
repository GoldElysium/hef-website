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
		<div className="absolute left-0 z-20 min-h-screen w-full bg-[#E6F0FF] dark:bg-[#021026]">
			<div className="mx-auto md:max-w-2xl">
				<h1 className="relative mb-4 mt-8 flex items-center justify-center border-b-2 border-[#0869EC] border-opacity-30 pb-2 text-4xl font-bold text-[#0869EC] dark:border-[#4C98FF] dark:text-[#4C98FF]">
					<button
						type="button"
						onClick={closeModal}
						className="absolute left-0 flex items-center gap-2 rounded-lg bg-[#0869EC] px-4 py-2 text-lg text-white dark:bg-[#216FD9]"
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
