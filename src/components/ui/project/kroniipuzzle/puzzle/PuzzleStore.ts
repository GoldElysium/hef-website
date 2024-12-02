/* eslint-disable no-param-reassign */
import { createWithEqualityFn } from 'zustand/traditional';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';
import { WritableDraft } from 'immer';
import { PUZZLE_WIDTH } from './PuzzleConfig';

export interface State {
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
	difficultyName: string | null;
	difficulty: Difficulty | null;
	correctCount: number;
	audio: {
		volume: number;
		muted: boolean;
	}
	shouldLoadPositions: boolean;
	firstLoad: boolean,
}

interface Difficulty {
	cols: number;
	rows: number;
	marginDivider: number;
}

interface Difficulties {
	[name: string]: Difficulty
}

export interface Actions {
	updatePiecePosition: (key: string) => (newPosition: { x: number; y:number; }) => void;
	updatePieceLocalPosition: (key: string, newPosition: { x: number; y:number; }) => void;
	updatePieceGroupPosition: (key: string) => (newPosition: { x: number; y:number; }) => void;
	// eslint-disable-next-line max-len
	changePieceGroup: (key: string) => (newGroupKey: string, positionData: Record<string, { x: number; y:number; }>) => void;
	setCorrect: (key: string) => () => void;
	setVolume: (volume: number) => void;
	setMuted: (muted: boolean) => void;
	setDifficulty: (name: string | null) => void;
	reset: () => void;
	setFirstLoad: (val: boolean) => void;
}

export type PuzzleStore = ReturnType<typeof createPuzzleStore>;

// eslint-disable-next-line max-len
function flatIndexToSpiralCoordinates(index: number, cols: number, rows: number): [number, number] | null {
	const centerRow = Math.ceil(rows / 3);

	let x = Math.max(Math.ceil(cols / 8), 2.5);
	let y = centerRow;

	let dx = 1;
	let dy = 0;

	const initialSideLength = Math.floor(rows / 2);
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

function reset(state: WritableDraft<State & Actions>) {
	if (!state.difficulty) return;

	state.pieces = {};
	state.pieceGroups = {};

	const pieceSize = PUZZLE_WIDTH / state.difficulty.cols;
	const pieceCount = state.difficulty.cols * state.difficulty.rows;

	const randomIndexArray = Array
		.from({ length: state.difficulty.cols * state.difficulty.rows }, (_, index) => index)
		.sort(() => Math.random() - 0.5);

	for (let r = 0; r < state.difficulty.rows; r++) {
		for (let c = 0; c < state.difficulty.cols; c++) {
			const index = randomIndexArray[r * state.difficulty.cols + c];
			const [cc, rr] = flatIndexToSpiralCoordinates(
				// eslint-disable-next-line max-len
				index + (Math.floor(pieceCount * 0.35)) + state.difficulty.rows + state.difficulty.cols,
				state.difficulty.cols,
				state.difficulty.rows,
			) || [0, 0];
			const x = cc * pieceSize * 1.75 - pieceSize * 2.5;
			const y = rr * pieceSize * 1.75 - pieceSize * 2.5;

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
					x: c * pieceSize,
					y: r * pieceSize,
				},
				pieces: [`${r}-${c}`],
				correct: false,
				randomIndex: randomIndexArray[r * state.difficulty.cols + c],
			};
		}
	}
}

export default function createPuzzleStore(projectId: string, devprops: { [key: string]: string }) {
	const difficulties = JSON.parse(devprops.difficulties) as Difficulties;

	return createWithEqualityFn(persist(
		immer<State & Actions>((set) => {
			const initialState: State = {
				pieces: {},
				pieceGroups: {},
				correctCount: 0,
				difficultyName: null,
				difficulty: null,
				audio: {
					volume: 0.05,
					muted: false,
				},
				shouldLoadPositions: false,
				firstLoad: true,
			};

			if (devprops.hasDifficulties !== 'true') {
				const difficulty = difficulties.default;
				initialState.difficultyName = 'default';
				initialState.difficulty = difficulty;

				reset(initialState as WritableDraft<State & Actions>);
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
						// Merge everything into the other group and delete the legacy group
						pieces.push(...oldPieces);
					} catch (e: any) {
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
					state.audio.volume = volume;
				}),
				setMuted: (muted) => set((state) => {
					state.audio.muted = muted;
				}),
				setDifficulty: (name: string | null) => set((state) => {
					if (name === null) {
						state.difficultyName = null;
						state.difficulty = null;
					} else if (difficulties[name]) {
						state.difficultyName = name;
						state.difficulty = difficulties[name];
					}

					reset(state);
				}),
				reset: () => set(reset),
				setFirstLoad: (val) => set((state) => {
					state.firstLoad = val;
				}),
			} satisfies State & Actions;
		}),
		{
			name: `puzzle-storage-${projectId}`,
		},
	));
}
