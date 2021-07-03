import React from 'react';
import ReactPlayer from 'react-player';
import InfiniteScroll from 'react-infinite-scroll-component';
import TextHeader from '../TextHeader';
import { ISubmission } from '../../models/Submission';

interface ISubmissionProps {
	data: ISubmission,
	index: number
}

const Submission = ({ data, index }: ISubmissionProps) => (
	<div className="w-full max-h-full text-black dark:text-white" key={data._id as unknown as string}>
		<div className="w-full flex mt-4 h-14">
			{data.srcIcon && (
				<img className="object-cover w-14 h-14 rounded-full" src={data.srcIcon} alt="author icon" />
			)}
			{data.author && (
				<div className="text-lg mt-3 ml-4">
					From:
					{' '}
					<span className="font-bold">{data.author}</span>
				</div>
			)}
			<div className="flex-grow" />
			<p className="text-xl mt-3 mr-4">{`#${index + 1}`}</p>
		</div>
		<div className="w-full mt-3">
			{data.type === 'video' && (
				<ReactPlayer
					width="100%"
					height="100%"
					url={data.src}
					controls
					light
					className="mb-4 mt-4"
				/>
			)}
			{data.type === 'image' && (
				<div className="mt-4 mb-2 w-full h-full max-h-[750px] flex justify-center">
					<img
						className="max-w-10/12 object-contain mb-4"
						src={data.src}
						alt=""
						loading="lazy"
					/>
				</div>
			)}
			{data.message && (
				<p className="mx-4 mb-4 w-auto h-full overflow-auto whitespace-pre-line dark:text-gray-300">
					{data.message}
				</p>
			)}
			<hr className="border-t-1 border-dashed border-gray-400" />
		</div>
	</div>
);

interface IProps {
	submissions: ISubmission[] | undefined,
}

const SUBMISSIONS_PER_LOAD = 10;

const Submissions = ({ submissions }: IProps) => {
	const [showLimit, setShowLimit] = React.useState(SUBMISSIONS_PER_LOAD);
	if (!submissions || submissions.length === 0) return <></>;

	const shownSubmissions = submissions.slice(0, showLimit);
	const hasMore = showLimit < submissions.length;
	const showMore = () => {
		setShowLimit(showLimit + SUBMISSIONS_PER_LOAD);
	};

	return (
		<div className="mt-4">
			<TextHeader text="Submissions" />
			<div className="flex flex-col items-center pt-2">
				<div className="w-full overflow-auto">
					<InfiniteScroll
						dataLength={shownSubmissions.length}
						next={showMore}
						hasMore={hasMore}
						loader={<p className="text-black dark:text-white text-center mt-4">Loading...</p>}
						scrollThreshold="600px"
					>
						<div className="w-full h-full flex justify-center">
							<div className="sm:w-11/12 md:w-10/12 h-full">
								{shownSubmissions.map((submission, index) => (
									<Submission
										data={submission}
										index={index}
										key={submission._id as unknown as string}
									/>
								))}
							</div>
						</div>
					</InfiniteScroll>
				</div>
			</div>
		</div>
	);
};

export default Submissions;
