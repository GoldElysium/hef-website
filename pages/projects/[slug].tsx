import ReactPlayer from 'react-player';
import {
	createRef, useEffect, useMemo, useState,
} from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline';
import InfiniteScroll from 'react-infinite-scroll-component';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from '../../components/Head';
import BlurBackground from '../../components/project/BlurBackground';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import Phaser from '../../components/project/Phaser';
import TextHeader from '../../components/TextHeader';
import { Flag, Guild, Media, Project, Submission, SubmissionMedia } from '../../types/payload-types';
import PayloadResponse from '../../types/PayloadResponse';
import DescriptionSerializer from '../../components/DescriptionSerializer';

const SUBMISSIONS_PER_LOAD = 10;

// ID's for both production and development databases
// TODO: Replace with Payload data
const ID_TO_STYLE_MAP = new Map<string, string>();
ID_TO_STYLE_MAP.set('62c16ca2b919eb349a6b09ba', 'theme-ina');

// NOTE: jp property should *ONLY* be used for translations, not everything is populated here
interface IProps {
	project: {
		en: Project;
		jp: {
			title: Project['title'];
			shortDescription: Project['shortDescription'];
			description: Project['description'];
		};
	};
	submissions: Submission[]
}

// eslint-disable-next-line max-len
export default function ProjectPage({ project, submissions }: IProps) {
	const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
	const [shownSubmissions, setShownSubmissions] = useState<Submission[]>([]);

	const ref = useMemo(() => createRef<BlurBackground>(), []);

	const themeStyle = ID_TO_STYLE_MAP.get((project.en.organizer as Guild).id);

	const loadMoreSubmissions = () => {
		const newSubLength = shownSubmissions.length + SUBMISSIONS_PER_LOAD;
		setShownSubmissions(submissions.slice(0, newSubLength));
	};

	useEffect(() => {
		setShownSubmissions(submissions.slice(0, SUBMISSIONS_PER_LOAD));
	}, [submissions]);

	function CurrentGalleryItem() {
		if (!project.en.media) return <></>;
		if (project.en.media[currentMediaIndex].type === 'video') {
			return (
				<ReactPlayer
					width="100%"
					height="100%"
					url={project.en.media[currentMediaIndex].url!}
					controls
					light
				/>
			);
		} if (project.en.media[currentMediaIndex].type === 'image') {
			return <img className="max-w-full max-h-full object-contain" src={(project.en.media[currentMediaIndex].media as Media).sizes!.thumbnail!.url} alt="" loading="lazy" />;
		}
		return <p>Invalid media</p>;
	}

	function Submissions() {
		// eslint-disable-next-line no-undef
		const submissionElements: JSX.Element[] = [];
		shownSubmissions.forEach((submission, index) => {
			submissionElements.push(
				<div className="w-full max-h-full text-black dark:text-white" key={submission.id as unknown as string}>
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
							<ReactPlayer
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

	if (project.en.flags?.includes('guratanabata')) {
		return (
			<>
				<Head
					/* TODO: Make customizable? */
					color="#FF3D3D"
					/* TODO: Use locale */
					title={project.en.title}
					description={project.en.shortDescription}
					keywords={['guratanabata']}
					image={(project.en.image as Media).sizes?.thumbnail?.url ?? 'https://holoen.fans/img/logo.png'}
				/>
				<BlurBackground ref={(bg) => { (ref as any).current = bg; }} />
				<Phaser
					scene="guratanabata"
					data={{
						setBackgroundImage: (to: string) => ref.current?.setBackgroundImage(to),
						submissions: submissions,
					}}
				/>
			</>
		);
	}

	return (
		<>
			<Head
				/* TODO: Make customizable? */
				color="#FF3D3D"
				/* TODO: Use locale */
				title={project.en.title}
				description={project.en.shortDescription}
				url={`https://holoen.fans/projects/${project.en.slug}`}
				keywords={[project.en.title.toLowerCase(), project.jp.title.toLowerCase()]}
				image={(project.en.image as Media).sizes?.thumbnail?.url ?? 'https://holoen.fans/img/logo.png'}
			/>

			<div className={themeStyle}>
				<div className="flex flex-col h-full min-h-screen bg-skin-background-1 dark:bg-skin-dark-background-1">
					{
						(project.en.flags as Flag[] | undefined)?.findIndex((flag) => flag.name === 'disableNavbar') === -1
						&& <Navbar disableHead />
					}

					{
						(project.en.flags as Flag[] | undefined)?.findIndex((flag) => flag.name === 'disableHeader') === -1
						&& (
							<Header
								title={project.en.title ?? 'unknown'}
								description={project.en.shortDescription ?? ''}
							/>
						)
					}

					<div className="flex-grow">
						<div className="my-16 w-full flex flex-col items-center">
							<div className="max-w-4xl w-full mx-4 break-words md:break-normal">
								<div>
									<TextHeader text="Description" />
									<div className="description-body">
										{DescriptionSerializer(project.en.description)}
									</div>
								</div>
								{(project.en.media?.length ?? 0) > 0 && (
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
													{project.en.media ? project.en.media.length : 0}
												</span>
												<ChevronRightIcon
													className={
														currentMediaIndex + 1
													< (project.en.media ? project.en.media.length : 0)
															? 'h-8 w-8 cursor-pointer text-black dark:text-white'
															: 'h-8 w-8 text-skin-primary-1 text-opacity-30 dark:text-skin-dark-primary-1 dark:text-opacity-30'
													}
													onClick={() => {
														if (
															currentMediaIndex + 1
														< (project.en.media ? project.en.media.length : 0)
														) { setCurrentMediaIndex(currentMediaIndex + 1); }
													}}
												/>
											</div>
										</div>
									</div>
								)}
								{(project.en.links?.length ?? 0) > 0 && (
									<div className="mt-4">
										<TextHeader text="Links" />
										<div className="flex justify-center space-x-6 px-4 sm:px-0">
											{project.en.links
											&& project.en.links.map((link, index: number) => (
												<div
													key={`link-${index}` /* eslint-disable-line react/no-array-index-key */}
													className="rounded-3xl font-bold w-[6rem] h-10 flex items-center justify-center mt-4 content-end
													bg-skin-secondary-1 dark:bg-skin-dark-secondary-1 text-white hover:text-opacity-70"
												>
													<a href={link.url} target="_blank" rel="noreferrer">
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
													hasMore={shownSubmissions.length < submissions.length}
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

					{!project.en.flags?.includes('disableFooter') && <Footer />}
				</div>
			</div>
		</>
	);
}

// @ts-ignore
export const getStaticPaths: GetStaticPaths = async () => {
	const res = await fetch(`${process.env.CMS_URL!}/api/projects?depth=0`);
	const projects: PayloadResponse<Project> = await res.json();

	return {
		paths: projects.docs.map((project) => (
			{
				params: { slug: project.slug },
			}
		)),
		fallback: false,
	};
};

export const getStaticProps: GetStaticProps = async (context) => {
	const slug = context.params!.slug as string;

	// Fetch EN and JP version for page, CMS will fallback to EN for any fields not translated
	const enProjectRes = await fetch(`${process.env.CMS_URL!}/api/projects?where[slug][equals]=${slug}&depth=2`);
	const enProject = (await enProjectRes.json() as PayloadResponse<Project>).docs[0];

	const jpProjectRes = await fetch(`${process.env.CMS_URL!}/api/projects?where[slug][equals]=${slug}&depth=0&locale=jp`);
	const jpProject = (await jpProjectRes.json() as PayloadResponse<Project>).docs[0];

	// Create an array for all the submissions
	let moreSubmissions = true;
	let page = 1;
	const submissions: Submission[] = [];

	async function fetchNextSubmissions() {
		// Fetch next page
		const submissionsRes = await fetch(`${process.env.CMS_URL!}/api/submissions?where[project][equals]=${enProject.id}&limit=100&page=${page}&depth=0`);
		const body: PayloadResponse<Submission> =  await submissionsRes.json();

		// Process submissions
		const tasks = body.docs.map(async (submission) => {
			// Fetch media if needed
			if (submission.srcIcon) {
				const mediaFetch = await fetch(`${process.env.CMS_URL!}/api/submission-media/${submission.srcIcon as string}`);
				const mediaBody: PayloadResponse<SubmissionMedia> = await mediaFetch.json();
				submission.srcIcon = mediaBody.docs[0];
			}

			if (submission.media) {
				const mediaFetch = await fetch(`${process.env.CMS_URL!}/api/submission-media/${submission.media as string}`);
				const mediaBody: PayloadResponse<SubmissionMedia> = await mediaFetch.json();
				submission.media = mediaBody.docs[0];
			}

			submissions.push(submission);
		});
		await Promise.all(tasks);

		// Set variables for next fetch
		page += 1;
		moreSubmissions = body.hasNextPage;
	}

	while (moreSubmissions) {
		await fetchNextSubmissions();
	}

	return {
		props: {
			project: {
				en: enProject,
				jp: {
					title: jpProject.title,
					shortDescription: jpProject.shortDescription,
					description: jpProject.description,
				},
			},
			submissions,
		} as IProps,
	};
};
