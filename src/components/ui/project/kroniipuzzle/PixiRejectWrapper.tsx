'use client';

import { Project, Submission } from '@/types/payload-types';
import OS from 'phaser/src/device/OS';
import { useRef } from 'react';
import PuzzleStoreContext from './puzzle/PuzzleStoreContext';
import PixiWrapper from './PixiWrapper';
import createPuzzleStore from './puzzle/PuzzleStore';

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
	const store = useRef(createPuzzleStore(project.id, project.devprops)).current;

	// @ts-ignore
	if ((OS.macOS && !window.chrome) || OS.iOS || OS.iPad) {
		return (
			<div className="min-w-screen absolute grid size-full min-h-screen place-items-center bg-black text-center text-lg font-bold text-white">
				Mobile Apple devices and desktop Safari are unsupported.
				Please use a desktop with Chrome to play this.
			</div>
		);
	}

	return (
		<PuzzleStoreContext.Provider value={store}>
			<PixiWrapper project={project} submissions={submissions} />
		</PuzzleStoreContext.Provider>
	);
}
