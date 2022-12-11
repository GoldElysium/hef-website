import { Submission as ISubmission, SubmissionMedia } from 'types/payload-types';
import ReactPlayerWrapper from 'ui/project/ReactPlayerWrapper';

interface IProps {
	submission: ISubmission;
	index: number;
}

export default function Submission({ submission, index }: IProps) {
	return (
		<div className="w-full max-h-full text-black dark:text-white">
			<div className="w-full flex mt-4 h-14">
				{submission.srcIcon && (
					<img className="object-cover w-14 h-14 rounded-full" src={(submission.srcIcon as SubmissionMedia).sizes!.icon!.url} alt="author icon" />
				)}
				{submission.author && (
					<div className="text-lg mt-3 ml-4">
						From:
						{' '}
						<span className="font-bold">{submission.author}</span>
					</div>
				)}
				<div className="flex-grow" />
				<p className="text-xl mt-3 mr-4">{`#${index + 1}`}</p>
			</div>
			<div className="w-full mt-3">
				{submission.type === 'video' && (
					<ReactPlayerWrapper
						width="100%"
						height="100%"
						url={submission.url!}
						controls
						light
						className="mb-4 mt-4"
					/>
				)}
				{submission.type === 'image' && (
					<div className="mt-4 mb-2 w-full h-full max-h-[750px] flex justify-center">
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img
							className="max-w-10/12 object-contain mb-4"
							src={(submission.media as SubmissionMedia).sizes?.thumbnail?.url}
							alt=""
							loading="lazy"
						/>
					</div>
				)}
				{submission.message && (
					<p className="mx-4 mb-4 w-auto h-full overflow-auto whitespace-pre-line dark:text-gray-300">
						{submission.message}
					</p>
				)}
				<hr className="border-t-1 border-dashed border-gray-400" />
			</div>
		</div>
	);
}
