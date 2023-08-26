'use client';

import { Project, Submission } from 'types/payload-types';
import OS from 'phaser/src/device/OS';
import PixiWrapper from './PixiWrapper';

interface IProps {
	project: Omit<Project, 'flags' | 'devprops'> & {
		flags: string[];
		devprops: {
			[key: string]: string;
		};
	};
	submissions: Submission[];
}

export default function PixiRejectWrapper({ project, submissions }: IProps) {
	if (!OS.desktop && (OS.iOS || OS.iPad)) {
		return (
			<div className="text-center grid place-items-center text-lg font-bold min-h-screen min-w-screen h-full w-full bg-black text-white absolute">
				Mobile Apple devices are unsupported. Please use a desktop to play this.
			</div>
		);
	}

	return (
		<PixiWrapper project={project} submissions={submissions} />
	);
}
