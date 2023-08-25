/* eslint-disable no-param-reassign */
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';
import {
	COL_COUNT, PIECE_COUNT, PIECE_SIZE, ROW_COUNT,
} from './PuzzleConfig';

interface State {
	pieces: {
		[key: string]: {
			position: {
				x: number;
				y: number;
			}
			localPosition: {
				x: number;
				y: number;
			}
			pieceGroup: string;
		}
	}
	pieceGroups: {
		[key: string]: {
			position: {
				x: number;
				y: number;
			}
			targetPosition: {
				x: number;
				y: number;
			}
			pieces: string[];
			correct: boolean;
			randomIndex: number;
		};
	}
	correctCount: number;
	audio: {
		volume: number;
		muted: boolean;
	}
	shouldLoadPositions: boolean;
	firstLoad: boolean,
}

interface Actions {
	updatePiecePosition: (key: string) => (newPosition: { x: number; y:number; }) => void;
	updatePieceLocalPosition: (key: string, newPosition: { x: number; y:number; }) => void;
	updatePieceGroupPosition: (key: string) => (newPosition: { x: number; y:number; }) => void;
	// eslint-disable-next-line max-len
	changePieceGroup: (key: string) => (newGroupKey: string, positionData: Record<string, { x: number; y:number; }>) => void;
	setCorrect: (key: string) => () => void;
	setVolume: (volume: number) => void;
	setMuted: (muted: boolean) => void;
	reset: () => void;
	setFirstLoad: (val: boolean) => void;
}

function flatIndexToSpiralCoordinates(index: number): [number, number] | null {
	const centerRow = Math.ceil(ROW_COUNT / 3);
	const centerCol = Math.ceil(COL_COUNT / 8);

	let x = centerCol;
	let y = centerRow;
	let dx = 1;
	let dy = 0;
	const initialSideLength = 10;
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

const usePuzzleStore = create(persist(
	immer<State & Actions>((set) => {
		const initialState: State = {
			pieces: {},
			pieceGroups: {},
			correctCount: 0,
			audio: {
				volume: 0.05,
				muted: false,
			},
			shouldLoadPositions: false,
			firstLoad: true,
		};

		const randomIndexArray = Array.from({ length: PIECE_COUNT }, (_, index) => index)
			.sort(() => Math.random() - 0.5);

		for (let r = 0; r < ROW_COUNT; r++) {
			for (let c = 0; c < COL_COUNT; c++) {
				const index = randomIndexArray[r * COL_COUNT + c];
				const [cc, rr] = flatIndexToSpiralCoordinates(
					index + (Math.floor(PIECE_COUNT * 0.35)) + 36,
				) || [0, 0];
				const x = cc * PIECE_SIZE * 1.75 - PIECE_SIZE * 2.5;
				const y = rr * PIECE_SIZE * 1.75 - PIECE_SIZE * 2.5;

				initialState.pieces[`${r}-${c}`] = {
					position: {
						x,
						y,
					},
					localPosition: {
						x: 0,
						y: 0,
					},
					pieceGroup: `${r}-${c}`,
				};
				initialState.pieceGroups[`${r}-${c}`] = {
					position: {
						x,
						y,
					},
					targetPosition: {
						x: c * PIECE_SIZE,
						y: r * PIECE_SIZE,
					},
					pieces: [`${r}-${c}`],
					correct: false,
					randomIndex: randomIndexArray[r * COL_COUNT + c],
				};
			}
		}

		return {
			...initialState,
			updatePiecePosition: (key) => (newPos) => set((state) => {
				state.pieces[key].position = newPos;
			}),
			updatePieceLocalPosition: (key, newPos) => set((state) => {
				state.pieces[key].localPosition = newPos;
			}),
			updatePieceGroupPosition: (key: string) => (newPos) => set((state) => {
				const pieceGroup = state.pieceGroups[key];
				pieceGroup.position = newPos;
			}),
			changePieceGroup: (key) => (newGroupKey, positionData) => set((state) => {
				const oldGroupKey = state.pieces[key].pieceGroup;
				const oldGroup = state.pieceGroups[oldGroupKey].pieces;

				// eslint-disable-next-line no-restricted-syntax
				for (const pieceKey of oldGroup) {
					state.pieces[pieceKey].pieceGroup = newGroupKey;
					state.pieces[pieceKey].localPosition = positionData[pieceKey];
				}

				// this errors out sometimes. state.pieceGroups[newGroupKey] is undefined
				try {
					const { pieces } = state.pieceGroups[newGroupKey];
					const oldPieces = state.pieceGroups[oldGroupKey].pieces;
					// Merge everything into the other group and delete the old group
					pieces.push(...oldPieces);
				} catch (e: any) {
					console.log(`oldGroupKey: ${oldGroupKey}, newGroupKey: ${newGroupKey}`);
					console.error(e);
					return;
				}
				delete state.pieceGroups[oldGroupKey];
			}),
			setCorrect: (key) => () => set((state) => {
				state.pieceGroups[key].correct = true;
				state.correctCount += state.pieceGroups[key].pieces.length;
			}),
			setVolume: (volume) => set((state) => {
				const oldVolume = state.audio.volume;
				console.log(`volume set: from ${oldVolume} to ${volume}`);
				state.audio.volume = volume;
			}),
			setMuted: (muted) => set((state) => {
				state.audio.muted = muted;
			}),
			reset: () => set((state) => {
				const newRandomIndexArray = Array.from({ length: PIECE_COUNT }, (_, index) => index)
					.sort(() => Math.random() - 0.5);

				for (let r = 0; r < ROW_COUNT; r++) {
					for (let c = 0; c < COL_COUNT; c++) {
						const index = newRandomIndexArray[r * COL_COUNT + c];
						const [cc, rr] = flatIndexToSpiralCoordinates(
							index + (Math.floor(PIECE_COUNT * 0.35)) + 36,
						) || [0, 0];
						const x = cc * PIECE_SIZE * 1.75 - PIECE_SIZE * 2.5;
						const y = rr * PIECE_SIZE * 1.75 - PIECE_SIZE * 2.5;

						state.pieces[`${r}-${c}`] = {
							position: {
								x,
								y,
							},
							localPosition: {
								x: 0,
								y: 0,
							},
							pieceGroup: `${r}-${c}`,
						};
						state.pieceGroups[`${r}-${c}`] = {
							position: {
								x,
								y,
							},
							targetPosition: {
								x: c * PIECE_SIZE,
								y: r * PIECE_SIZE,
							},
							pieces: [`${r}-${c}`],
							correct: false,
							randomIndex: randomIndexArray[r * COL_COUNT + c],
						};
						state.correctCount = 0;
					}
				}
			}),
			setFirstLoad: (val) => set((state) => {
				state.firstLoad = val;
			}),
		} satisfies State & Actions;
	}),
	{
		name: 'puzzle-storage',
	},
));

export default usePuzzleStore;
