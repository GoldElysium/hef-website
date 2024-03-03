'use client';

import {
	ComposableMap, Geographies, Geography, ZoomableGroup,
} from 'react-simple-maps';
// @ts-ignore
import { geoRobinson } from 'd3-geo-projection';
import { Project } from '@/types/payload-types';
import { useState } from 'react';

const geoUrl =	'https://cdn.holoen.fans/hefw/assets/kroniimap/ne_10m_admin_0_countries.json';

interface IProps {
	project: Omit<Project, 'flags' | 'devprops'> & {
		flags: string[];
		devprops: {
			[key: string]: string;
		};
	};
}

export default function KroniiMap({ project }: IProps) {
	return (
		<div className="bg-[#E6F0FF]">
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
								fill="#255494"
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
