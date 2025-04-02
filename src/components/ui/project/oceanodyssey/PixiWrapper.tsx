'use client';

import { Application, extend } from '@pixi/react';
import {
	Container, Graphics, GraphicsContextSystem, Sprite, Text,
} from 'pixi.js';
import { useEffect, useState } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import MainMenu from './scenes/MainMenu';
import Settings from './scenes/Settings';
import Game from './scenes/Game';
import Collectibles from './scenes/Collectibles';
import Shop from './scenes/Shop';
import FishData from './scenes/FishData';

GraphicsContextSystem.defaultOptions.bezierSmoothness = 0.8;

extend({
	Graphics,
	Container,
	Text,
	Sprite,
});

export default function PixiWrapper() {
	// TODO: Asset loading

	const [screenWidth, setScreenWidth] = useState(window.innerWidth);
	const [screenHeight, setScreenHeight] = useState(window.innerHeight);

	useEffect(() => {
		const handleResize = () => {
			setScreenWidth(window.innerWidth);
			setScreenHeight(window.innerHeight);
		};
		window.addEventListener('resize', handleResize);

		return () => window.removeEventListener('resize', handleResize);
	}, []);

	return (
		<Application
			backgroundColor={0x1099bb}
			antialias
			resizeTo={window}
		>
			<MemoryRouter initialEntries={['/']}>
				<Routes>
					<Route
						path="/"
						element={(
							<MainMenu
								width={screenWidth}
							/>
						)}
					/>
					<Route
						path="/game"
						element={(
							<Game
								width={screenWidth}
								height={screenHeight}
							/>
						)}
					/>
					<Route
						path="/settings"
						element={(
							<Settings
								width={screenWidth}
							/>
						)}
					/>
					<Route
						path="/collectibles"
						element={(
							<Collectibles
								width={screenWidth}
							/>
						)}
					/>
					<Route
						path="/fish-data"
						element={(
							<FishData
								width={screenWidth}
							/>
						)}
					/>
					<Route
						path="/shop"
						element={(
							<Shop
								width={screenWidth}
							/>
						)}
					/>
				</Routes>
			</MemoryRouter>
		</Application>
	);
}
