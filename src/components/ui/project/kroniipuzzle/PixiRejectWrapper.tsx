'use client';

import { Project, Submission } from '@/types/payload-types';
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
	// @ts-ignore
	if ((OS.macOS && !window.chrome) || OS.iOS || OS.iPad) {
		return (
			<div className="min-w-screen absolute grid h-full min-h-screen w-full place-items-center bg-black text-center text-lg font-bold text-white">
				Mobile Apple devices and desktop Safari are unsupported.
				Please use a desktop with Chrome to play this.
			</div>
		);
	}

	return (
		<PixiWrapper project={project} submissions={submissions} />
	);
}
