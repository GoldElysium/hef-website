'use client';

import { Guild, Project, Submission } from '@/types/payload-types';
import { useState } from 'react';
import TextHeader from '@/components/ui/old/TextHeader';
import DescriptionSerializer from '@/components/ui/project/util/DescriptionSerializer';
import Submissions from '@/components/ui/project/experimental/sana/Submissions';
import useTranslation from '@/lib/i18n/client';
import KroniiMap, { MarkerMap } from './KroniiMap';

interface IProps {
	project: Omit<Project, 'flags' | 'devprops'> & {
		flags: string[];
		devprops: {
			[key: string]: string;
		};
	};
	submissions: Submission[];
	markerMap: MarkerMap;
}

export default function Tabs({ project, submissions, markerMap }: IProps) {
	const [selectedTab, setSelectedTab] = useState('about');
	const { t } = useTranslation('project', 'page');

	return (
		<div className="bg-skin-background text-skin-text dark:bg-skin-background-dark dark:text-skin-text-dark">
			<div
				className="flex flex-row flex-wrap content-center justify-evenly border-b-2 border-skin-secondary py-4"
			>
				<button type="button">
					{/* eslint-disable-next-line max-len */}
					{/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions */}
					<h2
						className={
							`select-none text-center text-xl text-skin-link dark:text-skin-link-dark ${
								(selectedTab === 'about') ? 'font-bold' : ''}`
						}
						onClick={(e) => e.button === 0 && setSelectedTab('about')}
					>
						About
					</h2>
				</button>
				<button type="button">
					{/* eslint-disable-next-line max-len */}
					{/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions */}
					<h2
						className={
							`select-none text-center text-xl text-skin-link dark:text-skin-link-dark ${
								(selectedTab === 'map') ? 'font-bold' : ''}`
						}
						onClick={(e) => e.button === 0 && setSelectedTab('map')}
					>
						Map
					</h2>
				</button>
				<button type="button">
					{/* eslint-disable-next-line max-len */}
					{/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions */}
					<h2
						className={
							`select-none text-center text-xl text-skin-link dark:text-skin-link-dark ${
								(selectedTab === 'submissions') ? 'font-bold' : ''}`
						}
						onClick={(e) => e.button === 0 && setSelectedTab('submissions')}
					>
						Submissions
					</h2>
				</button>
			</div>

			<div>
				{(() => {
					if (selectedTab === 'about') {
						return (
							<div className="flex h-full min-h-screen flex-col">
								<div className="grow">
									<div className="my-16 flex w-full flex-col items-center px-4 md:px-16 lg:px-24 2xl:px-56">
										<div className="w-full max-w-full break-words px-4 sm:!max-w-4xl md:break-normal">
											<div className="flex justify-between">
												<TextHeader>
													{t('description.left')}
													<span className="text-skin-heading dark:text-skin-heading-dark">
														{t('description.right')}
													</span>
												</TextHeader>
												<div className="flex flex-col text-right">
													<span className="font-semibold">
														Organized by:
														{' '}
														<span className="text-skin-heading dark:text-skin-heading-dark">
															{(project.organizers as Guild[]).map((guild) => guild.name).join(', ')}
														</span>
													</span>
													<span>
														Released on:
														{' '}
														{
															(new Intl.DateTimeFormat('en-GB', {
																year: 'numeric',
																month: 'long',
																day: 'numeric',
															})
																.format(new Date(project.date)))
														}
													</span>
												</div>
											</div>
											<div className="description-body text-lg">
												{DescriptionSerializer(project.description)}
											</div>
										</div>
									</div>
								</div>
							</div>
						);
					}
					if (selectedTab === 'map') {
						return (
							<KroniiMap
								project={project}
								submissions={submissions}
								markerMap={markerMap}
							/>
						);
					}
					if (selectedTab === 'submissions') {
						return (
							<Submissions
								project={project}
								submissions={submissions}
							/>
						);
					}

					return null;
				})()}
			</div>
		</div>
	);
}
