'use client';

import { Submission } from 'types/payload-types';
import React, { ReactNode, useEffect, useState } from 'react';
import { CheckIcon, ChevronUpDownIcon, FunnelIcon } from '@heroicons/react/20/solid';
import { Listbox, Transition } from '@headlessui/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { debounce } from 'lodash';

interface IProps {
	submissions: {
		data: Submission;
		el: ReactNode;
	}[];
	filterOptions: {
		[key: string]: string[];
	}
}

export default function SubmissionsWithFilter({ submissions, filterOptions }: IProps) {
	const [filter, setFilter] = useState<IProps['filterOptions']>({});
	const [filterMenuOpen, setFilterMenuOpen] = useState(false);
	const [shownSubmissions, setShownSubmissions] = useState(submissions);

	const applyNewFilter = debounce(() => {
		let acceptableSubmissions = submissions;

		/* eslint-disable no-restricted-syntax */
		for (const key in filter) {
			if (Object.hasOwnProperty.call(filter, key)) {
				// eslint-disable-next-line no-continue
				if (filter[key].length === 0) continue;

				if (key === 'type') {
					acceptableSubmissions = acceptableSubmissions.filter((submission) => {
						let determinedType = 'Messages';
						if (submission.data.media!.length > 0) {
							determinedType = submission.data.media![0].type === 'image' ? 'Images' : 'Videos';
						}

						return filter.type.includes(determinedType);
					});
					// eslint-disable-next-line no-continue
					continue;
				}

				// eslint-disable-next-line arrow-body-style
				acceptableSubmissions = acceptableSubmissions.filter((submission) => {
					// eslint-disable-next-line arrow-body-style
					return filter[key].map((filterValue) => {
						return !!submission.data.filterableAttributes!
							.find((attribute) => attribute.name === key)!.values!
							.find((value) => value.value === filterValue);
					}).includes(true);
				});
			}
		}

		setShownSubmissions(acceptableSubmissions);
		/* eslint-enable */
	}, 500);

	useEffect(() => {
		applyNewFilter();
	}, [filter]);

	return (
		<>
			<h2
				className="text-skin-primary-1 dark:text-skin-dark-primary-1 border-skin-primary-1 dark:border-skin-dark-primary-1 mb-6 flex
			items-center justify-between border-b-2 border-opacity-30 pb-2 text-center
			text-2xl font-bold dark:border-opacity-40 sm:text-left"
			>
				Submissions
				<button
					type="button"
					className="flex items-center gap-1.5 rounded-full bg-[#EF4444] px-4 py-2 text-sm text-white hover:bg-red-400"
					onClick={() => setFilterMenuOpen(!filterMenuOpen)}
				>
					<FunnelIcon className="h-4 w-4" />
					Filter
				</button>
			</h2>
			<div className="flex flex-col items-center pt-2">
				<Transition
					as={React.Fragment}
					enter="transition ease-in duration-100"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="transition ease-in duration-100"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
					show={filterMenuOpen}
				>
					<div className="dark:bg-skin-dark-background-2 w-full rounded-md bg-white px-8 py-4 text-black dark:text-gray-300">
						<p className="font-bold">Current filter</p>
						<div className="flex items-center gap-4">
							<span>Submission type:</span>
							<Listbox
								value={filter.type ?? []}
								onChange={(newValue) => setFilter({ ...filter, type: newValue })}
								multiple
							>
								<div className="relative mt-1 w-[300px] text-black">
									<Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md sm:text-sm">
										<span className="block truncate text-black">{filter.type?.length > 0 ? filter.type.join(', ') : 'All'}</span>
										<span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
											<ChevronUpDownIcon
												className="h-5 w-5"
												aria-hidden="true"
											/>
										</span>
									</Listbox.Button>
									<Transition
										as={React.Fragment}
										leave="transition ease-in duration-100"
										leaveFrom="opacity-100"
										leaveTo="opacity-0"
									>
										<Listbox.Options className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
											{['Messages', 'Images', 'Videos'].map((type) => (
												<Listbox.Option
													key={`type-filter-${type}`}
													className={({ active }) => `relative cursor-default select-none py-2 pl-10 pr-4 ${
														active ? 'bg-red-100' : ''
													}`}
													value={type}
												>
													{({ selected }) => (
														<>
															<span
																className={`block truncate ${
																	selected ? 'font-medium' : 'font-normal'
																}`}
															>
																{type}
															</span>
															{selected ? (
																<span className="absolute inset-y-0 left-0 flex items-center pl-3 text-red-600">
																	<CheckIcon className="h-5 w-5" aria-hidden="true" />
																</span>
															) : null}
														</>
													)}
												</Listbox.Option>
											))}
										</Listbox.Options>
									</Transition>
								</div>
							</Listbox>
						</div>
						{(() => {
							const filters = [];
							/* eslint-disable no-restricted-syntax */
							for (const key in filterOptions) {
								if (Object.hasOwnProperty.call(filterOptions, key)) {
									filters.push(
										<div className="flex items-center gap-4" key={key}>
											<span>
												{key}
												:
											</span>
											<Listbox
												value={filter[key] ?? []}
												onChange={(newValue) => setFilter({ ...filter, [key]: newValue })}
												multiple
											>
												<div className="relative mt-1 w-[300px] text-black">
													<Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md sm:text-sm">
														<span className="block truncate text-black">{filter[key]?.length > 0 ? filter[key].join(', ') : 'All'}</span>
														<span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
															<ChevronUpDownIcon
																className="h-5 w-5"
																aria-hidden="true"
															/>
														</span>
													</Listbox.Button>
													<Transition
														as={React.Fragment}
														leave="transition ease-in duration-100"
														leaveFrom="opacity-100"
														leaveTo="opacity-0"
													>
														<Listbox.Options className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
															{filterOptions[key].map((value) => (
																<Listbox.Option
																	key={`${key}-filter-${value}`}
																	className={({ active }) => `relative cursor-default select-none py-2 pl-10 pr-4 ${
																		active ? 'bg-red-100' : ''
																	}`}
																	value={value}
																>
																	{({ selected }) => (
																		<>
																			<span
																				className={`block truncate ${
																					selected ? 'font-medium' : 'font-normal'
																				}`}
																			>
																				{value}
																			</span>
																			{selected ? (
																				<span className="absolute inset-y-0 left-0 flex items-center pl-3 text-red-600">
																					<CheckIcon className="h-5 w-5" aria-hidden="true" />
																				</span>
																			) : null}
																		</>
																	)}
																</Listbox.Option>
															))}
														</Listbox.Options>
													</Transition>
												</div>
											</Listbox>
										</div>,
									);
								}
							}
							/* eslint-enable */
							return filters;
						})()}
					</div>
				</Transition>
				<div className="w-full max-w-full overflow-auto">
					<div className="flex h-full w-full justify-center">
						<div className="h-full sm:w-11/12 md:w-10/12">
							{shownSubmissions.map((submission) => submission.el)}
						</div>
					</div>
					<p>You have reached the end!</p>
				</div>
			</div>
		</>
	);
}
