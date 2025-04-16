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
import FishDataScene from './scenes/FishDataScene';
import Spam from './scenes/Spam';

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
		<MemoryRouter initialEntries={['/']}>
			<Routes>
				<Route
					path="/"
					element={(
						<Application
							backgroundColor={0x1099bb}
							antialias
							resizeTo={window}
						>
							<MainMenu
								width={screenWidth}
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
					path="/collectibles"
					element={(
						<Collectibles
							backgroundColor="#1099bb"
						/>
					)}
				/>
				<Route
					path="/fish-data"
					element={(
						<Application
							backgroundColor={0x1099bb}
							antialias
							resizeTo={window}
						>
							<FishDataScene
								width={screenWidth}
							/>
						</Application>
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
