'use client';

/* eslint-disable react/no-array-index-key */
import React, {
	ReactElement, useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import * as PIXI from 'pixi.js';
import { Container, Graphics } from '@pixi/react';
import { IMediaInstance, Sound } from '@pixi/sound';
import { shallow } from 'zustand/shallow';
import { Submission, SubmissionMedia } from 'types/payload-types';
import Piece, { PieceActions } from './Piece';
import Message from './Message';
import PieceInfo from './PieceInfo';
import { COL_COUNT, PIECE_COUNT, ROW_COUNT } from './PuzzleConfig';
import usePuzzleStore from './PuzzleStore';
import PieceGroup from './PieceGroup';

interface PuzzleProps {
	x: number;
	y: number;
	width: number;
	height: number;
	puzzleFinished: () => void;
	onPieceSelected: (piece: PieceInfo) => void;
	submissions: Submission[];
}

const SOUNDS = {
	intro: 'intro',
	main1: 'main_01',
	choir: 'choir',
	main2: 'main_02',
	solo: 'solo',
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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [correctCount]);

	const drawPuzzleBounds = useCallback((g: PIXI.Graphics) => {
		const lineWidth = 8;
		g.clear();
		g.lineStyle(lineWidth, 0xffffff);

		g.drawRect(
			-lineWidth / 2,
			-lineWidth / 2,
			width + lineWidth,
			height + lineWidth,
		);
	}, [height, width]);

	useEffect(() => {
		// Sound doubling bug when auto pause is disabled
		// PixiSound.disableAutoPause = true;

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
			loadedSounds[name] = sound;
			// Very lazy way to check if everything is loaded
			if (Object.keys(loadedSounds).length === bgmTrackNames.length + sfxTrackNames.length) {
				setSounds(loadedSounds);
			}
		}

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
		// eslint-disable-next-line react-hooks/exhaustive-deps
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
					sound = SOUNDS.main1;
					break;
				default:
					// note: this should never happen
					sound = SOUNDS.main1;
					break;
			}

			const currentVolume = usePuzzleStore.getState().audio.volume;
			const instance = sounds![sound].play({ volume: currentVolume }) as IMediaInstance;

			const timer = setInterval(() => {
				if (instance.progress === 1) {
					nextSound();
				}
			}, 5000);

			setCurrentBgmInstance(instance);
			instance.on('end', () => {
				instance.destroy();
				nextSound();
				clearInterval(timer);
			});
		}

		introInstance.on('end', () => {
			introInstance.destroy();
			nextSound();
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [sounds]);

	useEffect(() => {
		currentBgmInstance?.set('volume', volume);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [volume]);

	useEffect(() => {
		currentBgmInstance?.set('paused', muted);
		// eslint-disable-next-line react-hooks/exhaustive-deps
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
				const message = submissions[r * COL_COUNT + c];

				const pieceRef = puzzlePiecesRefs[`${r}-${c}`];

				const piece = (
					<Piece
						key={`piece-${r}-${c}`}
						c={c}
						r={r}
						texture={assetBundle.pieces.textures[`${r}-${c}`]}
						setSelectedPiece={onPieceSelected}
						message={message ? {
							from: message.author,
							congratulations: message.devprops?.find((prop) => prop.key === 'congratulations')?.value,
							favoriteMoment: message.devprops?.find((prop) => prop.key === 'favoriteMoment')?.value,
							kronie: message.media && message.media.length > 0
								? (message.media[0].image as SubmissionMedia).url : undefined,
						} satisfies Message : undefined}
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
		// eslint-disable-next-line react-hooks/exhaustive-deps
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
