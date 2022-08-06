import { useContext, useEffect } from 'react';

import DarkModeContext from '../../../contexts/DarkModeContext';
import Footer from '../../Footer';
import Head from '../../Head';
import Header from '../../Header';
import Navbar from '../../Navbar';
import ProjectAbout from './About';
import ProjectBackgroundMusic from './BackgroundMusic';
import ProjectSubmissions from '../Submissions';
import ProjectTab from './Tab';
import ProjectTabs from './Tabs';
import ProjectTimeline from './Timeline';
import { IGuild } from '../../../models/Guild';
import { IProject } from '../../../models/Project';
import { ISubmission } from '../../../models/Submission';

const GUILD_TO_OSHI = Object.assign(Object.create(null), {
	'CGeclp7hLj-lpprbhKxX5': 'calli', 'hirD8XHurcDYFoNQOFh7p': 'calli',
	'jnTqYPtoPDKlvXKuBcHuo': 'kiara', 'J9600ROFekClHLwtzquhd': 'kiara',
	'rZNhEJYuseKIKkeSaUSD6': 'ina', 'rWykVp0wwqJfqVOiiwuHC': 'ina',
	'BSq6epH_Y1ffq0j1ZWOLT': 'gura', '0RdYs2xMNnjmHpIX3CvH6': 'gura',
	'mnFswH44ZCTyQiC8LPgRH': 'ame', 'pnJc6y2SRMbNunt1vOUkR': 'ame',
	'hpTi3BFuM46B5SBCyrc-5': 'irys', 'LHYI_i9eFfDYXksaKKxLB': 'irys',
	'RYpamVJXs76uWEept42Td': 'sana', '94mdRp-j2N8spCx-6UyRE': 'sana',
	'h_LNkS8pI64naLiWSafDj': 'fauna', 'BPyt7-SyXPhyTR9m5i6P2': 'fauna',
	'B5vtBaIkfuys1Ln3XMoOY': 'kronii', '-JoyPM46syqox0jp7NXG5': 'kronii',
	'-ew0gw2u7gk8GdFyxP1-u': 'kronii', '_0S7wwTwY17pDkHzWF9QH': 'kronii',
	'vCy2Gob7GNK3SOFufaV7K': 'mumei', 'c8FUeIsD1jP6a4xUMBubS': 'mumei',
	'lTv1XHPYI8tt7Lzh7g6qk': 'mumei', 'CesQIHnCRvh9RWkhC_XN_': 'mumei',
	'VkCh1E0PGq8swBN3h7sse': 'bae', 'jBX00De0x_fJWg7UhDkOK': 'bae',
});

export interface ProjectPageProps {
	guild: IGuild,
	project: IProject,
	submissions: ISubmission[],
}

export function ProjectPage({ guild, project, submissions }: ProjectPageProps) {
	const { setDarkMode } = useContext(DarkModeContext);

	useEffect(() => {
		if (project.flags?.includes('alwaysDarkMode')) setDarkMode(true);
		if (project.flags?.includes('alwaysLightMode')) setDarkMode(false);
	});

	return (
		<>
			<Head
				color={guild.color ?? (project.flags?.includes('sanaSendoff') ? '#FFF8E7' : '#FF3D3D')}
				title={project.title}
				description={project.shortDescription}
				keywords={[project.title.toLowerCase()]}
				image={project.ogImage ?? 'https://holoen.fans/img/logo.png'}
			/>

			{/* Hypothetically this could label the div with a nonexistant 'theme-'*/}
			{/* class but CSS just ignores nonexistant classes, so who cares? */}
			<div className={'theme-' + GUILD_TO_OSHI[guild._id!]}>
				{project.backgroundMusic != null && (
					<ProjectBackgroundMusic backgroundMusic={project.backgroundMusic!}/>
				)}

				<div className='flex flex-col h-full min-h-screen bg-skin-background-1 dark:bg-skin-dark-background-1'>
					{!project.flags?.includes('disableNavbar') && (<Navbar disableHead/>)}
					{!project.flags?.includes('disableHeader') && (
						<Header
							title={project.title ?? 'unknown'}
							description={project.shortDescription ?? ''}
							background={project.flags?.includes('sanaSendoff') ? '/assets/sanasendoff/background.png' : undefined}
						/>
					)}
					<div className='flex-grow'>
						<div className='my-16 w-full flex flex-col items-center'>
							<div className='max-w-4xl w-full mx-4 break-words md:break-normal'>
								{!project.flags?.includes('disableTabs') && (
									<ProjectTabs default='About'>
										<ProjectTab label='About'>
											<ProjectAbout project={project}/>
											{project.flags?.includes('sanaSendoff') && (
											// something something next/image something something
											// L + ratio, idc rn
												<img className='sana-letter' src='/assets/sanasendoff/letter.png'/>
											)}
										</ProjectTab>
										<ProjectTab label='Timeline'>
											<ProjectTimeline events={project.timeline!}/>
										</ProjectTab>
										{submissions.length > 0 && (
											project.flags?.includes('sectionedSubmissions') && (() => {
												// the submissions prop will never change; it's statically
												// assigned on the server side, so we don't need to
												// memorize this.
												const [artwork, pictures, videos, messages] = submissions
													.reduce(([_artwork, _pictures, _videos, _messages], submission) => {
														switch (submission.type) {
															case 'image':
																switch (submission.subtype) {
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
															case 'text':
																_messages.push(submission);
																break;
															case 'video':
																_videos.push(submission);
																break;
															default:
																console.warn('Unreachable code reached');
																break;
														}
														return [_artwork, _pictures, _videos, _messages];
													}, [[], [], [], []] as ISubmission[][]);
												return (
													<>
														{artwork.length > 0 && (
															<ProjectTab label='Artwork'>
																<ProjectSubmissions submissions={artwork} project={project}/>
															</ProjectTab>
														)}
														{pictures.length > 0 && (
															<ProjectTab label='Pictures'>
																<ProjectSubmissions submissions={pictures} project={project}/>
															</ProjectTab>
														)}
														{videos.length > 0 && (
															<ProjectTab label='Videos'>
																<ProjectSubmissions submissions={videos} project={project}/>
															</ProjectTab>
														)}
														{messages.length > 0 && (
															<ProjectTab label='Messages'>
																<ProjectSubmissions submissions={messages} project={project}/>
															</ProjectTab>
														)}
													</>
												);
											})() || (
												<ProjectTab label='Submissions'>
													<ProjectSubmissions submissions={submissions} project={project}/>
												</ProjectTab>
											)
										)}
									</ProjectTabs>
								) || (
									<>
										<ProjectAbout project={project}/>
										{/* PS: the ProjectTabs component provides a context -- use can use a */}
										{/* useContext hook to conditionally show headings on these components */}
										<ProjectTimeline events={project.timeline!}/>
										{submissions.length > 0 && (
											<ProjectSubmissions submissions={submissions} project={project}/>
										)}
									</>
								)}
							</div>
						</div>
					</div>
					{!project.flags?.includes('disableFooter') && (
						<Footer
							background={project.flags?.includes('sanaSendoff') ? '/assets/sanasendoff/background.png' : undefined}
						/>
					)}
				</div>
			</div>
		</>
	);
}

export default ProjectPage;
