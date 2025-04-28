'use client';

import { Application, extend } from '@pixi/react';
import {
	Container, Graphics, GraphicsContextSystem, Sprite, Text,
} from 'pixi.js';
import { useEffect, useState } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import type { Project } from '@/types/payload-types';
import MainMenu from './scenes/MainMenu';
import Settings from './scenes/Settings';
import Game from './scenes/Game';
import Logbook from './scenes/Logbook';
import Shop from './scenes/Shop';
import Spam from './scenes/Spam';
import useFishStore from './store/FishStore';
import { FishData } from './model/FishData';

GraphicsContextSystem.defaultOptions.bezierSmoothness = 0.8;

extend({
	Graphics,
	Container,
	Text,
	Sprite,
});

interface IProps {
	project: Omit<Project, 'flags' | 'devprops'> & {
		flags: string[];
		devprops: {
			[key: string]: string;
		};
	};
}

export default function PixiWrapper({ project }: IProps) {
	// TODO: Asset loading

	const [screenWidth, setScreenWidth] = useState(window.innerWidth);
	const [screenHeight, setScreenHeight] = useState(window.innerHeight);
	const [ready, setReady] = useState(false);

	const fishStore = useFishStore();

	useEffect(() => {
		setReady(false);
		(async () => {
			const res = await fetch(project.devprops.fishDataUrl);

			const parsedJson: FishData[] = await res.json();

			fishStore.setFishes(parsedJson);

			setReady(true);
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		const handleResize = () => {
			setScreenWidth(window.innerWidth);
			setScreenHeight(window.innerHeight);
		};
		window.addEventListener('resize', handleResize);

		return () => window.removeEventListener('resize', handleResize);
	}, []);

	if (!ready) {
		return (
			<div className="bg-skin-background-dark grid place-items-center text-skin-text-dark min-h-screen">
				<h2 className="text-xl">Loading...</h2>
			</div>
		);
	}

	return (
		<MemoryRouter initialEntries={['/']}>
			<Routes>
				<Route
					path="/"
					element={(
						<Application
							key="mainMenu"
							backgroundColor={0x414141}
							antialias
							resizeTo={window}
						>
							<MainMenu
								project={project}
							/>
						</Application>
					)}
				/>
				<Route
					path="/game"
					element={(
						<Application
							backgroundColor={0x1099bb}
							antialias
							resizeTo={window}
						>
							<Game
								width={screenWidth}
								height={screenHeight}
							/>
						</Application>
					)}
				/>
				<Route
					path="/spam"
					element={(
						<Application
							backgroundColor={0x1099bb}
							antialias
							resizeTo={window}
						>
							<Spam
								width={screenWidth}
								height={screenHeight}
							/>
						</Application>
					)}
				/>
				<Route
					path="/settings"
					element={(
						<Application
							backgroundColor={0x1099bb}
							antialias
							resizeTo={window}
						>
							<Settings
								width={screenWidth}
							/>
						</Application>
					)}
				/>
				<Route
					path="/logbook"
					element={(
						<Logbook />
					)}
				/>
				<Route
					path="/shop"
					element={(
						<Application
							backgroundColor={0x1099bb}
							antialias
							resizeTo={window}
						>
							<Shop
								width={screenWidth}
							/>
						</Application>
					)}
				/>
			</Routes>
		</MemoryRouter>
	);
}
