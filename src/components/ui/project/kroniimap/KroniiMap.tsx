'use client';

import {
// @ts-expect-error useZoomPanContext does not exist
	ComposableMap, Geographies, Geography, Marker, ZoomableGroup, useZoomPanContext,
} from 'react-simple-maps';
// @ts-expect-error no types
import { geoRobinson } from 'd3-geo-projection';
import { Submission as ISubmission, SubmissionMedia } from '@/types/payload-types';
import { useTheme } from 'next-themes';
import { useMemo, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/20/solid';
import SubmissionGallery from '@/components/ui/project/SubmissionGallery';
import Image from 'next/image';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

export interface MarkerMap {
	[key: string]: {
		id: string;
		pos: [number, number];
		submissions: string[];
	}
}

type Submission = Omit<ISubmission, 'media' | 'srcIcon'> & { media: Array<NonNullable<Required<ISubmission>['media']>[number] & { image: SubmissionMedia }>; srcIcon: SubmissionMedia };

interface IProps {
	submissions: Submission[];
	markerMap: MarkerMap;
}

interface IMapMarkerProps {
	coordinates: [number, number];
	onClick?: () => void;
}

function MapMarker({ coordinates, onClick }: IMapMarkerProps) {
	const panZoom = useZoomPanContext();

	return (
		<Marker coordinates={coordinates} onClick={onClick}>
			<image
				href="https://cdn.holoen.fans/hefw/assets/kroniimap/kronii-wave.gif"
				height={5 / Math.max(panZoom.k as number / 6, 1)}
				width={5 / Math.max(panZoom.k as number / 6, 1)}
				x={-2.5 / Math.max(panZoom.k as number / 6, 1)}
				y={-2.5 / Math.max(panZoom.k as number / 6, 1)}
				className="cursor-pointer"
			/>
		</Marker>
	);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function KroniiMap({ submissions, markerMap }: IProps) {
	const { resolvedTheme } = useTheme();

	const [openSubmissions, setOpenSubmissions] = useState<Submission[]>([]);
	const [submissionIndex, setSubmissionIndex] = useState(0);

	const [lowPolyMode, setLowPolyMode] = useState(false);
	const [center, setCenter] = useState<[number, number]>([0, 0]);
	const [zoom, setZoom] = useState(1);

	const submissionsMap = useMemo(() => {
		const map = new Map<string, Submission>();

		submissions.forEach((submission) => {
			map.set(submission.id, submission);
		});

		return map;
	}, [submissions]);

	return (
		<>
			<div className="absolute left-6 z-10 mt-2 flex gap-2 rounded-md bg-skin-secondary px-4 py-2 dark:bg-skin-secondary-dark">
				<input
					id="lowPolyMode"
					type="checkbox"
					checked={lowPolyMode}
					onChange={() => setLowPolyMode(!lowPolyMode)}
				/>
				<label htmlFor="lowPolyMode">
					Performance mode (low poly)
				</label>
			</div>

			<ComposableMap
				projection={geoRobinson()}
				width={980}
				height={493}
			>
				<ZoomableGroup
					onMoveEnd={(position) => {
						setZoom(position.zoom);
						setCenter(position.coordinates);
					}}
					center={center}
					zoom={zoom}
					maxZoom={200}
				>
					<Geographies geography={`https://cdn.holoen.fans/hefw/assets/kroniimap/ne_${lowPolyMode ? '110' : '50'}m_admin_0_countries.json`}>
						{({ geographies }: { geographies: any[] }) => geographies.map((geo) => (
							<Geography
								key={geo.rsmKey}
								geography={geo}
								fill={resolvedTheme === 'dark' ? '#EEEEEE' : '#255494'}
								className="focus:outline-0"
								style={{ pressed: {} }}
							/>
						))}
					</Geographies>
					{Object.values(markerMap).map((entry) => (
						<MapMarker
							coordinates={entry.pos}
							onClick={() => {
								setSubmissionIndex(0);
								setOpenSubmissions(
									entry.submissions
										.map((id) => submissionsMap.get(id))
										.filter((submission) => submission) as Submission[],
								);
							}}
							key={entry.id}
						/>
					))}
					<Marker coordinates={[-41, 30]}>
						<text textAnchor="middle" fontSize={8} fill={resolvedTheme === 'dark' ? '#EEEEEE' : '#255494'}>
							<tspan x={0}>Scroll to zoom</tspan>
							<tspan x={0} y="1.2em">Left mouse button to pan</tspan>
						</text>
					</Marker>
					<Marker coordinates={[-36, 10]}>
						<image href="https://cdn.holoen.fans/hefw/assets/kroniimap/kronie-boat.gif" height="6" width="6" />
					</Marker>
				</ZoomableGroup>
			</ComposableMap>

			{openSubmissions.length > 0 && (() => {
				const currentSubmission = openSubmissions[submissionIndex];
				const hasPersonalizedKronie = currentSubmission.devprops!.findIndex((prop) => prop.key === 'hasPersonalizedKronie') !== -1;
				const hasSignature = currentSubmission.devprops!.findIndex((prop) => prop.key === 'hasSignature') !== -1;
				// eslint-disable-next-line max-len
				const mediaLength = (currentSubmission.media.length - (hasPersonalizedKronie ? 1 : 0) - (hasSignature ? 1 : 0));
				const actualMedia = currentSubmission.media.slice(0, mediaLength);

				return (
					(
						<div className="fixed left-0 top-0 z-20 grid min-h-screen w-full place-items-center bg-black/40 text-white">
							<div className="relative">
								<div className="absolute -top-16 flex items-center gap-8">
									<button
										type="button"
										onClick={() => setOpenSubmissions([])}
										className="flex items-center gap-2 rounded-lg bg-skin-primary px-4 py-2 text-lg text-white dark:bg-skin-primary-dark"
									>
										<XMarkIcon className="size-6" />
										Close
									</button>

									{openSubmissions.length > 1 && (
										<div
											className="flex items-center justify-center rounded-md bg-skin-secondary px-2 py-1 text-center font-bold"
										>
											<ChevronLeftIcon
												className={
													submissionIndex > 0
														? 'dark:text-skin-text-dark-dark size-8 cursor-pointer text-skin-text'
														: 'dark:text-skin-dark-primary size-8 text-skin-primary text-opacity-30 dark:text-opacity-30'
												}
												onClick={() => {
													if (submissionIndex > 0) {
														setSubmissionIndex(submissionIndex - 1);
													}
												}}
											/>
											<span className="text-black dark:text-white">
												{submissionIndex + 1}
												/
												{openSubmissions.length}
											</span>
											<ChevronRightIcon
												className={
													submissionIndex + 1 < openSubmissions.length
														? 'dark:text-skin-text-dark-dark size-8 cursor-pointer text-skin-text'
														: 'dark:text-skin-dark-primary size-8 text-skin-primary text-opacity-30 dark:text-opacity-30'
												}
												onClick={() => {
													if (
														submissionIndex + 1 < openSubmissions.length
													) {
														setSubmissionIndex(submissionIndex + 1);
													}
												}}
											/>
										</div>
									)}
								</div>
								<div className="flex items-center gap-4">
									<div className="h-[36rem] w-[24rem] overflow-y-auto bg-white px-4 py-8 text-black">
										<div className="mb-2 flex items-center gap-4">
											{
												hasPersonalizedKronie && (
													<img
														src={
															hasSignature
																// eslint-disable-next-line max-len
																? currentSubmission.media![currentSubmission.media!.length - 2].image.url!
																// eslint-disable-next-line max-len
																: currentSubmission.media![currentSubmission.media!.length - 1].image.url!
														}
														alt="Kronie"
														className="size-16"
													/>
												)
											}
											<div className="font-bold">
												<p>
													From:
													{' '}
													{currentSubmission.author}
												</p>
												<p>
													{(() => {
														const location = JSON.parse(
															currentSubmission.devprops!
																.find((prop) => prop.key === 'location')!
																.value,
														);

														const locationArray = [location.city, location.state, location.country]
															.filter((str) => str);

														return locationArray.join(', ');
													})()}
												</p>
											</div>
										</div>
										<p>
											{currentSubmission.message}
										</p>
										{
											hasSignature && (
												<img
													src={
													// eslint-disable-next-line max-len
														currentSubmission.media![currentSubmission.media!.length - 1].image.url!
													}
													alt="Signature"
													className="mt-2 h-24"
												/>
											)
										}
									</div>
									{
										mediaLength > 0 && (
											<div className="h-[36rem] w-[46rem] bg-white px-6 pb-4">
												<SubmissionGallery
													submission={{ media: actualMedia } as Submission}
													elements={actualMedia.map((media, index) => (
														<Image
															key={media.id}
															src={media.image.url!}
															alt={`Submission from ${currentSubmission.author}`}
															className="-mt-2 max-h-[30rem] max-w-[42rem] object-contain"
															loading={index === 0 ? 'eager' : 'lazy'}
															width={1280}
															height={780}
														/>
													))}
												/>
											</div>
										)
									}
								</div>
							</div>
						</div>
					)
				);
			})()}
		</>
	);
}
