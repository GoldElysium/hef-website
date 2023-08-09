'use client';

/* eslint-disable react/no-array-index-key */
import React, {
	ReactElement,
	useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import * as PIXI from 'pixi.js';
import { Sprite as PixiSprite } from 'pixi.js';
import { Container, Graphics } from '@pixi/react';
import { IMediaInstance, Sound } from '@pixi/sound';
import { WebAudioContext } from '@pixi/sound/lib/webaudio';
import { shallow } from 'zustand/shallow';
import Piece, { PieceActions } from './Piece';
import Message from './Message';
import PieceInfo from './PieceInfo';
import {
	COL_COUNT, PIECE_COUNT, ROW_COUNT,
} from './PuzzleConfig';
import usePuzzleStore from './PuzzleStore';
import PieceGroup from './PieceGroup';

interface PuzzleProps {
	x: number;
	y: number;
	width: number;
	height: number;
	puzzleFinished: () => void;
	onPieceSelected: (piece: PieceInfo) => void;
	submissions: Message[];
}

const SOUNDS = {
	intro: 'intro',
	main1: 'main_01',
	choir: 'choir',
	main2: 'main_02',
	solo: 'solo',
	drums: 'drums_only',
};

const getRandom = (
	arr: { name: string, weight: number }[],
) => {
	const totalWeight = arr.reduce((sum, item) => sum + item.weight, 0);
	let randomNum = Math.random() * totalWeight;

	let { name } = arr[arr.length - 1];
	// eslint-disable-next-line no-restricted-syntax
	for (const item of arr) {
		randomNum -= item.weight;
		if (randomNum <= 0) {
			name = item.name;
			break;
		}
	}

	return name;
};

export default function Puzzle({
	// @ts-ignore
	x, y, width, height, puzzleFinished, onPieceSelected, submissions,
}: PuzzleProps) {
	const [assetBundle, setAssetBundle] = useState<null | any>(null);
	const [sounds, setSounds] = useState<null | Record<string, Sound>>(null);
	const [currentBgmInstance, setCurrentBgmInstance] = useState<IMediaInstance>();

	const { volume, muted } = usePuzzleStore((state) => state.audio);

	const puzzlePiecesRefs: Record<string, React.MutableRefObject<PieceActions>> = {};

	const correctCount = usePuzzleStore((state) => state.correctCount);
	const pieceGroups = usePuzzleStore((state) => Object.keys(state.pieceGroups), shallow);

	useEffect(() => {
		if (correctCount >= PIECE_COUNT) {
			puzzleFinished();
		}
	}, [correctCount]);

	const drawPuzzleBounds = useCallback((g: PIXI.Graphics) => {
		const lineWidth = 6;
		g.clear();
		g.lineStyle(lineWidth, 0xffffff);
		console.log('Redrawing container');

		g.drawRect(
			lineWidth / 2,
			lineWidth / 2,
			width - lineWidth / 2,
			height - lineWidth / 2,
		);
	}, [height, width]);

	useEffect(() => {
		PIXI.Assets.loadBundle('puzzle')
			.then((loadedBundle) => {
				setAssetBundle(loadedBundle);
			});
	}, []);

	useEffect(() => {
		const bgmTrackNames = ['intro', 'main_01', 'main_02', 'choir', 'solo'];
		const sfxTrackNames = ['tick', 'tock'];
		const loadedSounds: Record<string, Sound> = {};

		function loadCallback(name: string, sound: Sound) {
			// eslint-disable-next-line no-param-reassign
			(sound.context as WebAudioContext).autoPause = false;
			loadedSounds[name] = sound;
			// Very lazy way to check if everything is loaded
			if (Object.keys(loadedSounds).length === bgmTrackNames.length + sfxTrackNames.length) {
				setSounds(loadedSounds);
			}
		}

		console.log(`initial volume: ${volume}`);
		const defaultSettings = {
			preload: true,
			volume,
			singleInstance: true,
		};

		const loadBgmTrack = (name: string) => {
			Sound.from({
				url: `/assets/kroniipuzzle/bgm/time_loop_${name}.ogg`,
				loaded: (_, sound) => loadCallback(name, sound!),
				...defaultSettings,
			});
		};

		const loadSfxTrack = (name: string) => {
			Sound.from({
				url: `/assets/kroniipuzzle/sfx/${name}.wav`,
				loaded: (_, sound) => loadCallback(name, sound!),
				...{
					preload: true,
					volume: 0.25,
					singleInstance: true,
				},
			});
		};

		// eslint-disable-next-line no-restricted-syntax
		for (const name of bgmTrackNames) {
			loadBgmTrack(name);
		}

		// eslint-disable-next-line no-restricted-syntax
		for (const name of sfxTrackNames) {
			loadSfxTrack(name);
		}

		return () => {
			// eslint-disable-next-line no-restricted-syntax
			for (const name of bgmTrackNames) {
				if (loadedSounds[name]) {
					loadedSounds[name].stop();
					loadedSounds[name].destroy();
				}
			}

			// eslint-disable-next-line no-restricted-syntax
			for (const name of sfxTrackNames) {
				if (loadedSounds[name]) {
					loadedSounds[name].stop();
					loadedSounds[name].destroy();
				}
			}
		};
	}, []);

	useEffect(() => {
		if (!sounds) return;

		let sound = SOUNDS.intro;

		// eslint-disable-next-line max-len
		const startVolume = usePuzzleStore.getState().audio.volume;
		const introInstance = sounds.intro.play({ volume: muted ? 0 : startVolume }) as IMediaInstance;
		if (muted) {
			introInstance.set('paused', true);
			introInstance.set('volume', startVolume);
		}
		setCurrentBgmInstance(introInstance);

		function nextSound() {
			switch (sound) {
				case SOUNDS.intro:
					sound = SOUNDS.main1;
					break;
				case SOUNDS.main1:
					sound = getRandom([
						{ name: SOUNDS.choir, weight: 1 },
						{ name: SOUNDS.main2, weight: 2 },
					]);
					break;
				case SOUNDS.choir:
					sound = getRandom([
						{ name: SOUNDS.choir, weight: 1 },
						{ name: SOUNDS.main2, weight: 2 },
					]);
					break;
				case SOUNDS.main2:
					sound = getRandom([
						{ name: SOUNDS.main1, weight: 2 },
						{ name: SOUNDS.solo, weight: 1 },
					]);
					break;
				case SOUNDS.solo:
					sound = getRandom([
						{ name: SOUNDS.main1, weight: 2 },
						{ name: SOUNDS.drums, weight: 1 },
					]);
					break;
				case SOUNDS.drums:
					sound = getRandom([
						{ name: SOUNDS.main1, weight: 1 },
					]);
					break;
				default:
					// note: this should never happen
					sound = SOUNDS.main1;
					break;
			}

			console.log(`Playing sound ${sound}`);
			const currentVolume = usePuzzleStore.getState().audio.volume;
			const instance = sounds![sound].play({ volume: currentVolume }) as IMediaInstance;
			setCurrentBgmInstance(instance);
			instance.on('end', () => nextSound());
		}

		introInstance.on('end', () => {
			nextSound();
		});
	}, [sounds]);

	useEffect(() => {
		currentBgmInstance?.set('volume', volume);
	}, [volume]);

	useEffect(() => {
		currentBgmInstance?.set('paused', muted);
	}, [muted]);

	for (let r = 0; r < ROW_COUNT; r++) {
		for (let c = 0; c < COL_COUNT; c++) {
			// eslint-disable-next-line react-hooks/rules-of-hooks
			puzzlePiecesRefs[`${r}-${c}`] = useRef<PieceActions>() as any;
		}
	}

	const puzzlePieces = useMemo(() => {
		if (!assetBundle) return null;

		const temp: Record<string, { ref: React.MutableRefObject<any>, piece: ReactElement }> = {};

		for (let r = 0; r < ROW_COUNT; r++) {
			for (let c = 0; c < COL_COUNT; c++) {
				// TODO: Remove this type coercion in prod
				const message = submissions[r * COL_COUNT + c] as unknown as string;

				const words = message.split(' ');
				const midpoint = Math.floor(words.length / 2);

				const congrats = words.slice(0, midpoint).join(' ');
				const congratulations = congrats + (congrats[congrats.length - 1] !== '.' ? '.' : '');
				const f = words.slice(midpoint).join(' ');
				const favoriteMoment = f.charAt(0).toUpperCase() + f.slice(1);
				const kronie = new PixiSprite(assetBundle.kronie);

				// todo: this doesn't stick for some reason. not really an issue though
				// since the tinting is just for debug purposes
				kronie.tint = new PIXI.Color([Math.random(), Math.random(), Math.random()]);

				const pieceRef = puzzlePiecesRefs[`${r}-${c}`];

				const piece = (
					<Piece
						key={`piece-${r}-${c}`}
						c={c}
						r={r}
						texture={assetBundle.pieces.textures[`${r}-${c}`]}
						setSelectedPiece={onPieceSelected}
						message={{
							from: `${c}_${r}`,
							congratulations,
							favoriteMoment,
							isRead: false,
						} satisfies Message}
						kronie={kronie}
						ref={pieceRef}
					/>
				);
				if (!piece) {
					// eslint-disable-next-line no-continue
					continue;
				}
				temp[`${r}-${c}`] = {
					ref: pieceRef,
					piece,
				};
			}
		}

		return temp;
	}, [assetBundle]);

	const groupElements = useMemo(() => {
		if (!puzzlePieces) return null;
		const groups = usePuzzleStore.getState().pieceGroups;

		return pieceGroups.map((groupKey) => {
			const { position } = groups[groupKey];

			return (
				<PieceGroup
					key={groupKey}
					groupKey={groupKey}
					pieces={puzzlePieces}
					initialX={position.x}
					initialY={position.y}
					playTick={() => sounds?.tick.play()}
					playTock={() => sounds?.tock.play()}
				/>
			);
		});
	}, [puzzlePieces, pieceGroups, sounds?.tick, sounds?.tock]);

	if (!assetBundle || !puzzlePieces) return null;

	return (
		<Container x={x} y={y} sortableChildren>
			<Graphics
				width={width}
				height={height}
				draw={drawPuzzleBounds}
				zIndex={-2}
			/>
			{groupElements}
		</Container>
	);
}
