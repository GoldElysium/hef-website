
import Footer from '../../Footer';
import Head from '../../Head';
import Header from '../../Header';
import Navbar from '../../Navbar';
import ProjectAbout from './About';
import ProjectTab from './Tab';
import ProjectTabs from './Tabs';
import ProjectTimeline from './Timeline';
import { IGuild } from '../../../models/Guild';
import { IProject } from '../../../models/Project';

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
}

export function ProjectPage({ guild, project }: ProjectPageProps) {
	return (
		<>
			<Head
				color={guild.color ?? '#FF3D3D'}
				title={project.title}
				description={project.shortDescription}
				keywords={[project.title.toLowerCase()]}
				image={project.ogImage ?? 'https://holoen.fans/img/logo.png'}
			/>

			{/* Hypothetically this could label the div with a nonexistant "theme-"*/}
			{/* class but CSS just ignores nonexistant classes, so who cares? */}
			<div className={'container theme-' + GUILD_TO_OSHI[guild._id!]}>
				<div className="flex flex-col h-full min-h-screen bg-skin-background-1 dark:bg-skin-dark-background-1">
					{!project.flags?.includes('disableNavbar') && (<Navbar disableHead/>)}
					{!project.flags?.includes('disableHeader') && (
						<Header
							title={project.title ?? 'unknown'}
							description={project.shortDescription ?? ''}
						/>
					)} 
					<div className="flex-grow">
						<div className="my-16 w-full flex flex-col items-center">
							<div className="max-w-4xl w-full mx-4 break-words md:break-normal">
								{!project.flags?.includes('disableTabs') && (
									<ProjectTabs>
										<ProjectTab label="About">
											<ProjectAbout project={project}/>
										</ProjectTab>
										{(project.timeline?.length ?? 0) > 0 && (
											<ProjectTab label="Timeline">
												<ProjectTimeline events={project.timeline!}/>
											</ProjectTab>
										)}
									</ProjectTabs>
								) || (
									<>
										<ProjectAbout project={project}/>
										{(project.timeline?.length ?? 0) > 0 && (
											<ProjectTimeline events={project.timeline!}/>
										)}
									</>
								)}
							</div>
						</div>
					</div>
					{!project.flags?.includes('disableFooter') && (<Footer/>)}
				</div>
			</div>
		</>
	);
}

export default ProjectPage;
