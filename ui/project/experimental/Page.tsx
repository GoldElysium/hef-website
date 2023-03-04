import {
	Guild, Project, Submission as ISubmission, Submission, SubmissionMedia,
} from 'types/payload-types';
import Header from 'ui/Header';
import ProjectSubmissions from 'ui/project/experimental/Submissions';
import ProjectAbout from 'ui/project/experimental/About';
import ProjectBackgroundMusic from 'ui/project/experimental/BackgroundMusic';
import ProjectCredits from 'ui/project/experimental/Credits';
import ProjectTab from 'ui/project/experimental/Tab';
import ProjectTabs from 'ui/project/experimental/Tabs';
import ProjectTimeline from 'ui/project/experimental/Timeline';
import DarkModeFlag from 'ui/project/experimental/DarkModeFlag';
import PayloadResponse from 'types/PayloadResponse';
import { getImageUrl } from '../../Image';

const GUILD_TO_OSHI = Object.assign(Object.create(null), {
	'CGeclp7hLj-lpprbhKxX5': 'calli',
	hirD8XHurcDYFoNQOFh7p: 'calli',
	jnTqYPtoPDKlvXKuBcHuo: 'kiara',
	J9600ROFekClHLwtzquhd: 'kiara',
	rZNhEJYuseKIKkeSaUSD6: 'ina',
	rWykVp0wwqJfqVOiiwuHC: 'ina',
	BSq6epH_Y1ffq0j1ZWOLT: 'gura',
	'0RdYs2xMNnjmHpIX3CvH6': 'gura',
	mnFswH44ZCTyQiC8LPgRH: 'ame',
	pnJc6y2SRMbNunt1vOUkR: 'ame',
	'hpTi3BFuM46B5SBCyrc-5': 'irys',
	LHYI_i9eFfDYXksaKKxLB: 'irys',
	RYpamVJXs76uWEept42Td: 'sana',
	'94mdRp-j2N8spCx-6UyRE': 'sana',
	h_LNkS8pI64naLiWSafDj: 'fauna',
	'BPyt7-SyXPhyTR9m5i6P2': 'fauna',
	B5vtBaIkfuys1Ln3XMoOY: 'kronii',
	'-JoyPM46syqox0jp7NXG5': 'kronii',
	'-ew0gw2u7gk8GdFyxP1-u': 'kronii',
	_0S7wwTwY17pDkHzWF9QH: 'kronii',
	vCy2Gob7GNK3SOFufaV7K: 'mumei',
	c8FUeIsD1jP6a4xUMBubS: 'mumei',
	lTv1XHPYI8tt7Lzh7g6qk: 'mumei',
	CesQIHnCRvh9RWkhC_XN_: 'mumei',
	VkCh1E0PGq8swBN3h7sse: 'bae',
	jBX00De0x_fJWg7UhDkOK: 'bae',

	// Payload ID's
	'62f23b24333a65054af560d9': 'sana',
	'63209a0af2be5d1c9590fb62': 'sana',
});

export interface ProjectPageProps {
	project: {
		en: Omit<Project, 'flags' | 'devprops'> & {
			flags: string[];
			devprops: {
				[key: string]: string;
			};
		};
		jp: {
			title: Project['title'];
			shortDescription: Project['shortDescription'];
			description: Project['description'];
		};
	};
}

async function fetchSubmissions(project: ProjectPageProps['project']['en']) {
	// Create an array for all the submissions
	let moreSubmissions = true;
	let page = 1;
	const submissions: Submission[] = [];

	async function fetchNextSubmissions() {
		// Fetch next page
		const submissionsRes = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL!}/api/submissions?where[project][equals]=${project.id}&limit=100&page=${page}&depth=0`, {
			headers: {
				'X-RateLimit-Bypass': process.env.PAYLOAD_BYPASS_RATE_LIMIT_KEY ?? '',
			} as Record<string, string>,
		});
		const body: PayloadResponse<Submission> = await submissionsRes.json();

		// Process submissions
		const tasks = body.docs.map(async (submission) => {
			// Fetch media if needed
			if (submission.srcIcon) {
				const mediaFetch = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL!}/api/submission-media/${submission.srcIcon as string}`, {
					headers: {
						'X-RateLimit-Bypass': process.env.PAYLOAD_BYPASS_RATE_LIMIT_KEY ?? '',
					} as Record<string, string>,
				});
				// eslint-disable-next-line no-param-reassign
				submission.srcIcon = await mediaFetch.json();
				// eslint-disable-next-line no-param-reassign,max-len
				(submission.srcIcon as SubmissionMedia).url = getImageUrl({ src: (submission.srcIcon as SubmissionMedia).url!, width: 56 });
			}

			const mediaDocs: ISubmission['media'] = [];
			await Promise.all(submission.media.map(async (item) => {
				if (item.type !== 'image') {
					mediaDocs.push(item);
					return;
				}

				const mediaFetch = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL!}/api/submission-media/${item.image as string}`, {
					headers: {
						'X-RateLimit-Bypass': process.env.PAYLOAD_BYPASS_RATE_LIMIT_KEY ?? '',
					} as Record<string, string>,
				});
				mediaDocs.push({
					...item,
					image: await mediaFetch.json(),
				});
			}));

			// eslint-disable-next-line no-param-reassign
			submission.media = mediaDocs;

			submissions.push(submission);
		});
		await Promise.all(tasks);

		// Set variables for next fetch
		page += 1;
		moreSubmissions = body.hasNextPage;
	}

	while (moreSubmissions) {
		// eslint-disable-next-line no-await-in-loop
		await fetchNextSubmissions();
	}

	return submissions;
}

export default async function ProjectPage({ project }: ProjectPageProps) {
	const submissions = await fetchSubmissions(project.en);

	return (
		<>
			<DarkModeFlag project={project} />

			{/* Hypothetically this could label the div with a nonexistant 'theme-' */}
			{/* class but CSS just ignores nonexistant classes, so who cares? */}
			<div className={`theme-${GUILD_TO_OSHI[(project.en.organizer as Guild).id]}`}>
				{project.en.devprops.backgroundMusic && (
					<ProjectBackgroundMusic backgroundMusic={project.en.devprops.backgroundMusic!} />
				)}

				<div className="flex flex-col h-full min-h-screen bg-skin-background-1 dark:bg-skin-dark-background-1">
					{!project.en.flags?.includes('disableHeader') && (
						<Header
							title={project.en.title ?? 'unknown'}
							description={project.en.shortDescription ?? ''}
							background={project.en.flags?.includes('sanaSendoff') ? '/assets/sanasendoff/background.png' : undefined}
						/>
					)}
					<div className="flex-grow pb-16">
						<div className="my-32 w-full flex flex-col items-center">
							<div className="max-w-4xl w-full mx-4 break-words md:break-normal">
								{(!project.en.flags?.includes('disableTabs') && (
									<ProjectTabs defaultTab="About">
										<ProjectTab label="About">
											<ProjectAbout project={project.en} />
											{project.en.flags?.includes('sanaSendoff') && (
												// something something next/image something something
												// L + ratio, idc rn
												<img className="sana-letter" src="/assets/sanasendoff/letter.png" alt="Letter to Sana" />
											)}
										</ProjectTab>
										<ProjectTab label="Timeline">
											<ProjectTimeline />
										</ProjectTab>
										{submissions.length > 0 && (
											(project.en.flags?.includes('sectionedSubmissions') && (() => {
												// the submissions prop will never change; it's statically
												// assigned on the server side, so we don't need to
												// memorize this.
												const [artwork, pictures, videos, messages] = submissions
													.reduce(([_artwork, _pictures, _videos, _messages], submission) => {
														if (submission.media.length > 0) {
															switch (submission.media[0].type) {
																case 'image':
																	switch (submission.media[0].subtype) {
																		case 'artwork':
																			_artwork.push(submission);
																			break;
																		case 'picture':
																			_pictures.push(submission);
																			break;
																		default:
																			_pictures.push(submission);
																			break;
																	}
																	break;
																case 'video':
																	_videos.push(submission);
																	break;
																default:
																	// eslint-disable-next-line no-console
																	console.warn('Unreachable code reached');
																	break;
															}
														} else {
															_messages.push(submission);
														}

														return [_artwork, _pictures, _videos, _messages];
													}, [[], [], [], []] as Submission[][]);
												return (
													<>
														{artwork.length > 0 && (
															<ProjectTab label="Artwork">
																<ProjectSubmissions
																	submissions={artwork}
																	project={project.en}
																/>
															</ProjectTab>
														)}
														{pictures.length > 0 && (
															<ProjectTab label="Pictures">
																<ProjectSubmissions
																	submissions={pictures}
																	project={project.en}
																/>
															</ProjectTab>
														)}
														{videos.length > 0 && (
															<ProjectTab label="Videos">
																<ProjectSubmissions
																	submissions={videos}
																	project={project.en}
																/>
															</ProjectTab>
														)}
														{messages.length > 0 && (
															<ProjectTab label="Messages">
																<ProjectSubmissions
																	submissions={messages}
																	project={project.en}
																/>
															</ProjectTab>
														)}
													</>
												);
											})()) || (
												<ProjectTab label="Submissions">
													<ProjectSubmissions submissions={submissions} project={project.en} />
												</ProjectTab>
											)
										)}
										{project.en.devprops.credits != null && (
											<ProjectTab label="Credits">
												<ProjectCredits credits={JSON.parse(project.en.devprops.credits)} />
											</ProjectTab>
										)}
									</ProjectTabs>
								)) || (
									<>
										<ProjectAbout project={project.en} />
										{/* PS: the ProjectTabs component provides a context -- use can use a */}
										{/* useContext hook to conditionally show headings on these components */}
										<ProjectTimeline />
										{submissions.length > 0 && (
											<ProjectSubmissions submissions={submissions} project={project.en} />
										)}
									</>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
