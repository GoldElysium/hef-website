'use client';

/* eslint-disable react/no-array-index-key */
import React, {
	useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import * as PIXI from 'pixi.js';
import { Sprite as PixiSprite } from 'pixi.js';
import { Container, Graphics } from '@pixi/react';
import { IMediaInstance, Sound } from '@pixi/sound';
import Piece, { PieceActions } from './Piece';
import Message from './Message';
import PieceInfo from './PieceInfo';
import {
	COL_COUNT, PIECE_COUNT, PIECE_SIZE, ROW_COUNT,
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

function flatIndexToSpiralCoordinates(index: number): [number, number] | null {
	// todo: these are hard-coded. possibly need to change
	const centerRow = Math.ceil(ROW_COUNT / 3);
	const centerCol = Math.ceil(COL_COUNT / 8);

	let x = centerCol;
	let y = centerRow;
	let dx = 1;
	let dy = 0;
	const initialSideLength = 13;
	let sideLength = initialSideLength;
	let stepsInSide = 0;
	let currentIndex = 0;

	while (currentIndex < index) {
		x += dx;
		y += dy;
		currentIndex += 1;

		stepsInSide += 1;

		if (stepsInSide >= sideLength) {
			if (dx === 1 && dy === 0) {
				// Right to Down
				dx = 0;
				dy = 1;
				sideLength -= initialSideLength - 1;
			} else if (dx === 0 && dy === 1) {
				// Down to Left
				dx = -1;
				dy = 0;
				sideLength += initialSideLength;
			} else if (dx === -1 && dy === 0) {
				// Left to Up
				dx = 0;
				dy = -1;
				sideLength -= initialSideLength - 1;
			} else if (dx === 0 && dy === -1) {
				// Up to Right
				dx = 1;
				dy = 0;
				sideLength += initialSideLength;
			}

			stepsInSide = 0;
		}
	}

	if (currentIndex === index) {
		return [x, y];
	}

	return null;
}

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

	const puzzlePiecesRefs: Record<string, React.MutableRefObject<PieceActions>> = {};

	const correctCount = usePuzzleStore((state) => state.correctCount);
	// TODO: This selector causes unnecessary re-renders when piece groups move
	const pieceGroups = usePuzzleStore((state) => state.pieceGroups);

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
		const loadedSounds: Record<string, Sound> = {};

		function loadCallback(name: string, sound: Sound) {
			loadedSounds[name] = sound;
			// Very lazy way to check if everything is loaded
			if (Object.keys(loadedSounds).length === 5) {
				setSounds(loadedSounds);
			}
		}

		const defaultSettings = {
			preload: true,
			volume: 0.1,
			singleInstance: true,
		};

		Sound.from({
			url: '/assets/kroniipuzzle/bgm/time_loop_intro.ogg',
			loaded: (_, sound) => loadCallback('intro', sound!),
			...defaultSettings,
		});

		Sound.from({
			url: '/assets/kroniipuzzle/bgm/time_loop_main_01.ogg',
			loaded: (_, sound) => loadCallback('main_01', sound!),
			...defaultSettings,
		});

		Sound.from({
			url: '/assets/kroniipuzzle/bgm/time_loop_main_02.ogg',
			loaded: (_, sound) => loadCallback('main_02', sound!),
			...defaultSettings,
		});

		Sound.from({
			url: '/assets/kroniipuzzle/bgm/time_loop_choir.ogg',
			loaded: (_, sound) => loadCallback('choir', sound!),
			...defaultSettings,
		});

		Sound.from({
			url: '/assets/kroniipuzzle/bgm/time_loop_solo.ogg',
			loaded: (_, sound) => loadCallback('solo', sound!),
			...defaultSettings,
		});

		Sound.from({
			url: '/assets/kroniipuzzle/bgm/time_loop_drums_only.ogg',
			loaded: (_, sound) => loadCallback('drums_only', sound!),
			...defaultSettings,
		});
	}, []);

	useEffect(() => {
		if (!sounds) return;

		let sound = SOUNDS.intro;

		const introInstance = sounds.intro.play() as IMediaInstance;

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
			const instance = sounds![sound].play() as IMediaInstance;
			instance.on('end', () => nextSound());
		}

		introInstance.on('end', () => {
			nextSound();
		});
	}, [sounds]);

	for (let r = 0; r < ROW_COUNT; r++) {
		for (let c = 0; c < COL_COUNT; c++) {
			// eslint-disable-next-line react-hooks/rules-of-hooks
			puzzlePiecesRefs[`${r}-${c}`] = useRef<PieceActions>() as any;
		}
	}

	const puzzlePieces = useMemo(() => {
		if (!assetBundle) return null;

		const temp: Record<string, { ref: React.MutableRefObject<any>, piece: JSX.Element }> = {};

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

	if (!assetBundle || !puzzlePieces) return null;

	return (
		<Container x={x} y={y} sortableChildren>
			<Graphics
				width={width}
				height={height}
				draw={drawPuzzleBounds}
				zIndex={-2}
			/>
			{Object.entries(pieceGroups)
				.map(([groupKey, pieceGroup]) => {
					const coords = flatIndexToSpiralCoordinates(
						pieceGroup.randomIndex + (Math.floor(PIECE_COUNT * 0.6) - 10),
					);
					const [c, r] = coords || [0, 0];

					return (
						<PieceGroup
							key={groupKey}
							groupKey={groupKey}
							pieces={puzzlePieces}
							// todo: the adjustment of + and - PIECE_SIZE need tweaking
							initialX={c * PIECE_SIZE * 1.5 + PIECE_SIZE}
							initialY={r * PIECE_SIZE * 1.5 - PIECE_SIZE}
						/>
					);
				})}
		</Container>
	);
}
