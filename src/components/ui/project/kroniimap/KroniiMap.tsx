'use client';

import {
	ComposableMap, Geographies, Geography, ZoomableGroup,
} from 'react-simple-maps';
// @ts-ignore
import { geoRobinson } from 'd3-geo-projection';
import { Project } from '@/types/payload-types';
import { useTheme } from 'next-themes';

const geoUrl =	'https://cdn.holoen.fans/hefw/assets/kroniimap/ne_10m_admin_0_countries.json';

interface IProps {
	project: Omit<Project, 'flags' | 'devprops'> & {
		flags: string[];
		devprops: {
			[key: string]: string;
		};
	};
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function KroniiMap({ project }: IProps) {
	const { resolvedTheme } = useTheme();

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
				</ZoomableGroup>
			</ComposableMap>
		</div>
	);
}
