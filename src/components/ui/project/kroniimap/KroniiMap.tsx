'use client';

import {
	ComposableMap, Geographies, Geography, Marker, ZoomableGroup,
} from 'react-simple-maps';
// @ts-ignore
import { geoRobinson } from 'd3-geo-projection';
import { Project, Submission } from '@/types/payload-types';
import { useTheme } from 'next-themes';

const geoUrl =	'https://cdn.holoen.fans/hefw/assets/kroniimap/ne_10m_admin_0_countries.json';

export interface KroniiMapSubmission extends Submission {
	marker: [number, number];
}

export interface MarkerMap {
	[key: string]: {
		id: string;
		pos: [number, number];
		submissions: string[];
	}
}

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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function KroniiMap({ project, submissions, markerMap }: IProps) {
	const { resolvedTheme } = useTheme();

	/*	const submissionsMap = useMemo(() => {
		const map = new Map<string, Submission>();

		submissions.forEach((submission) => {
			map.set(submission.id, submission);
		});

		return map;
	}, [submissions]); */

	return (
		<div className="bg-skin-background dark:bg-skin-background-dark">
			<ComposableMap
				projection={geoRobinson()}
				width={980}
				height={493}
			>
				<ZoomableGroup>
					<Geographies geography={geoUrl}>
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
					{Object.values(markerMap).map((entry) => {
						console.log(entry);
						// TODO: handle showing submissions

						return (
							<Marker coordinates={entry.pos} key={entry.id}>
								<circle r={1} fill="#F53" />
							</Marker>
						);
					})}
				</ZoomableGroup>
			</ComposableMap>
		</div>
	);
}
