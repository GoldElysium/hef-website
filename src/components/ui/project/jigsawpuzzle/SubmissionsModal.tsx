import { Project, Submission } from '@/types/payload-types';
import { ArrowLeftIcon } from '@heroicons/react/20/solid';
import Submissions from '@/components/ui/project/experimental/sana/Submissions';

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
		<div className="absolute left-0 z-20 min-h-screen w-full bg-skin-background dark:bg-skin-background-dark">
			<div className="mx-auto md:max-w-2xl">
				<h1 className="relative mb-4 mt-8 flex items-center justify-center border-b-2 border-skin-text/30 pb-2 text-4xl font-bold text-skin-text dark:border-skin-text-dark dark:text-skin-text-dark">
					<button
						type="button"
						onClick={closeModal}
						className="absolute left-0 flex items-center gap-2 rounded-lg bg-skin-primary px-4 py-2 text-lg text-skin-primary-foreground dark:bg-skin-primary-dark dark:text-skin-primary-foreground-dark"
					>
						<ArrowLeftIcon className="size-6" />
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
