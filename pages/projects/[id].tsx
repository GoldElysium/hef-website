import ReactPlayer from 'react-player';
import { useEffect, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline';
import { useRouter } from 'next/router';
import ReactMarkdown from 'react-markdown';
import InfiniteScroll from 'react-infinite-scroll-component';
import { GetServerSideProps } from 'next';
import mongoose from 'mongoose';
import safeJsonStringify from 'safe-json-stringify';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import TextHeader from '../../components/TextHeader';
import Links from '../../components/project/Links';
import Project, { IProject } from '../../models/Project';
import Submission, { ISubmission } from '../../models/Submission';
import 'github-markdown-css';

const SUBMISSIONS_PER_LOAD = 10;

interface IProps {
	doc: IProject,
	allSubmissions: ISubmission[]
}

// eslint-disable-next-line max-len
export default function ProjectPage({ doc, allSubmissions }: IProps) {
	const router = useRouter();
	const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
	const [shownSubmissions, setShownSubmissions] = useState<ISubmission[]>([]);

	const loadMoreSubmissions = () => {
		const newSubLength = shownSubmissions.length + SUBMISSIONS_PER_LOAD;
		setShownSubmissions(allSubmissions.slice(0, newSubLength));
	};

	useEffect(() => {
		setShownSubmissions(allSubmissions.slice(0, SUBMISSIONS_PER_LOAD));
	}, [allSubmissions]);

	function CurrentGalleryItem() {
		if (!doc.media) return <></>;
		if (doc.media[currentMediaIndex].type === 'video') {
			return (
				<ReactPlayer
					width="100%"
					height="100%"
					url={doc.media[currentMediaIndex].src}
					controls
					light
				/>
			);
		} if (doc.media[currentMediaIndex].type === 'image') {
			return <img className="max-w-full max-h-full object-contain" src={doc.media[currentMediaIndex].src} alt="" loading="lazy" />;
		}
		return <p>Invalid media</p>;
	}

	function Submissions() {
		// eslint-disable-next-line no-undef
		const submissionElements: JSX.Element[] = [];
		shownSubmissions.forEach((submission, index) => {
			submissionElements.push(
				<div className="w-full max-h-full text-black dark:text-white" key={submission._id as unknown as string}>
					<div className="w-full flex mt-4 h-14">
						{submission.srcIcon && (
							<img className="object-cover w-14 h-14 rounded-full" src={submission.srcIcon} alt="author icon" />
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
							<ReactPlayer
								width="100%"
								height="100%"
								url={submission.src}
								controls
								light
								className="mb-4 mt-4"
							/>
						)}
						{submission.type === 'image' && (
							<div className="mt-4 mb-2 w-full h-full max-h-[750px] flex justify-center">
								<img
									className="max-w-10/12 object-contain mb-4"
									src={submission.src}
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
				</div>,
			);
		});

		return (
			<div className="w-full h-full flex justify-center">
				<div className="sm:w-11/12 md:w-10/12 h-full">
					{submissionElements}
				</div>
			</div>
		);
	}

	/* if (errorCode) {
		return <Error statusCode={errorCode as number} />;
	} */

	let themeStyle = 'theme-ina';
	if (router.query.id === '3') {
		themeStyle = 'theme-gura';
	}

	return (
		<div className={themeStyle}>
			<div className="flex flex-col h-full min-h-screen bg-skin-background-1 dark:bg-skin-dark-background-1">
				<Navbar />

				<Header
					title={doc.title ?? 'unknown'}
					description={doc.shortDescription ?? ''}
				/>

				<div className="flex-grow">
					<div className="my-16 w-full flex flex-col items-center">
						<div className="max-w-4xl w-full mx-4 break-words md:break-normal">
							<div>
								<TextHeader text="Description" />
								<div className="markdown-body">
									<ReactMarkdown className="px-4 sm:px-0 text-black dark:text-white dark:text-opacity-80">
										{
											doc.description && doc.description
												.replace(/(\\\n```)/gim, '\n```')
												.replace(/(```\n\\)|(```\n\n\\)/gim, '```\n')
										}
									</ReactMarkdown>
								</div>
							</div>
							{(doc.media?.length ?? 0) > 0 && (
								<div className="mt-4">
									<TextHeader text="Gallery" />
									<div className="flex flex-col items-center pt-2">
										<div className="w-full h-52 sm:w-8/12 sm:h-96">
											<CurrentGalleryItem />
										</div>
										<div className="flex mt-2 font-bold items-center justify-center text-center">
											<ChevronLeftIcon
												className={
													currentMediaIndex > 0
														? 'h-8 w-8 cursor-pointer text-black dark:text-white'
														: 'h-8 w-8 text-skin-primary-1 text-opacity-30 dark:text-skin-dark-primary-1 dark:text-opacity-30'
												}
												onClick={() => {
													if (currentMediaIndex > 0) {
														setCurrentMediaIndex(currentMediaIndex - 1);
													}
												}}
											/>
											<span className="text-black dark:text-white">
												{currentMediaIndex + 1}
												/
												{doc.media ? doc.media.length : 0}
											</span>
											<ChevronRightIcon
												className={
													currentMediaIndex + 1
													< (doc.media ? doc.media.length : 0)
														? 'h-8 w-8 cursor-pointer text-black dark:text-white'
														: 'h-8 w-8 text-skin-primary-1 text-opacity-30 dark:text-skin-dark-primary-1 dark:text-opacity-30'
												}
												onClick={() => {
													if (
														currentMediaIndex + 1
														< (doc.media ? doc.media.length : 0)
													) { setCurrentMediaIndex(currentMediaIndex + 1); }
												}}
											/>
										</div>
									</div>
								</div>
							)}
							<Links links={doc.links} />
							{/* TODO: Move submissions to separate tab */}
							{((shownSubmissions?.length ?? 0) > 0) && (
								<div className="mt-4">
									<TextHeader text="Submissions" />
									<div className="flex flex-col items-center pt-2">
										<div className="w-full overflow-auto">
											<InfiniteScroll
												dataLength={shownSubmissions.length}
												next={loadMoreSubmissions}
												hasMore={shownSubmissions.length < allSubmissions.length}
												loader={<p className="text-black dark:text-white text-center mt-4">Loading...</p>}
												scrollThreshold="500px"
											>
												<Submissions />
											</InfiniteScroll>
										</div>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>

				<Footer />
			</div>
		</div>
	);
}

export const getServerSideProps: GetServerSideProps = async (context) => {
	try {
		mongoose.connect(process.env.MONGOOSEURL as string, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: false,
		});
		// eslint-disable-next-line no-empty
	} catch (e) {}

	const project = await Project.findById(context.params?.id).lean().exec()
		.catch((e) => {
			throw e;
		});

	if (!project) {
		return {
			notFound: true,
		};
	}

	const projectData: IProject = await JSON.parse(safeJsonStringify(project));

	const submissions: ISubmission[] = await Submission.find({
		project: Number.parseInt(context.params?.id as string, 10),
	}).lean().exec().catch((e) => {
		throw e;
	});

	const projectSubmissions: ISubmission[] = await JSON.parse(safeJsonStringify(submissions));

	return {
		props: {
			doc: projectData,
			allSubmissions: projectSubmissions,
		},
	};
};
