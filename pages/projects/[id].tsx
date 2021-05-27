import ReactPlayer from 'react-player';
import { useEffect, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline';
import Error from 'next/error';
import { useRouter } from 'next/router';
import ReactMarkdown from 'react-markdown';
import InfiniteScroll from 'react-infinite-scroll-component';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import TextHeader from '../../components/TextHeader';
import { IProject } from '../../models/Project';
import { ISubmission } from '../../models/Submission';
import 'github-markdown-css';

const SUBMISSIONS_PER_LOAD = 10;

export default function ProjectPage() {
	const router = useRouter();
	const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
	const [doc, setDoc] = useState<IProject>({} as IProject);
	const [allSubmissions, setAllSubmissions] = useState<ISubmission[]>([]);
	const [shownSubmissions, setShownSubmissions] = useState<ISubmission[]>([]);
	const [errorCode, setErrorCode] = useState<boolean | number>(false);

	useEffect(() => {
		async function run() {
			if (!router.query.id) return;
			const res = await fetch(`/api/projects/${router.query.id}`, {
				method: 'GET',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json;charset=UTF-8',
				},
			});
			// eslint-disable-next-line consistent-return
			if (!res.ok) return setErrorCode(res.status);

			const submissionsRes = await fetch(`/api/submissions/${router.query.id}`, {
				method: 'GET',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json;charset=UTF-8',
				},
			});
			// eslint-disable-next-line consistent-return
			if (!submissionsRes.ok) return setErrorCode(submissionsRes.status);

			const json: IProject = await res.json();
			setDoc(json);
			const submissionsJson: ISubmission[] = await submissionsRes.json();
			setAllSubmissions(submissionsJson);
			setShownSubmissions(submissionsJson.slice(0, SUBMISSIONS_PER_LOAD));
		}

		run();
	}, [router.query]);

	const loadMoreSubmissions = () => {
		const newSubLength = shownSubmissions.length + SUBMISSIONS_PER_LOAD;
		setShownSubmissions(allSubmissions.slice(0, newSubLength));
	};

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

	if (errorCode) {
		return <Error statusCode={errorCode as number} />;
	}

	return (
		<div className="theme-ina">
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
							{(doc.links?.length ?? 0) > 0 && (
								<div className="mt-4">
									<TextHeader text="Links" />
									<div className="flex justify-center space-x-6 px-4 sm:px-0">
										{doc.links
											&& doc.links.map((link, index) => (
												<div
													key={`link-${index}` /* eslint-disable-line react/no-array-index-key */}
													className="rounded-3xl font-bold w-[6rem] h-10 flex items-center justify-center mt-4 content-end
													bg-skin-secondary-1 dark:bg-skin-dark-secondary-1 text-white hover:text-opacity-70"
												>
													<a href={link.link} target="_blank" rel="noreferrer">
														{link.name}
													</a>
												</div>
											))}
									</div>
								</div>
							)}
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
