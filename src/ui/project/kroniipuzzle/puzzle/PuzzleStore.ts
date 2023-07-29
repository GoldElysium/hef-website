/* eslint-disable no-param-reassign */
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { devtools } from 'zustand/middleware';
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
	saveState: () => void;
}

function flatIndexToSpiralCoordinates(index: number): [number, number] | null {
	// todo: these are hard-coded. possibly need to change
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

// Function to save the state to localStorage
const saveStateToLocalStorage = (state: State) => {
	try {
		const serializedState = JSON.stringify(state);
		localStorage.setItem('puzzleState', serializedState);
		// console.log('Data saved to localStorage');
	} catch (error) {
		console.error('Error saving state to localStorage:', error);
	}
};

// Function to load the state from localStorage
const loadStateFromLocalStorage = () => {
	try {
		const serializedState = localStorage.getItem('puzzleState');
		console.log('Data loaded from localStorage:', serializedState);
		return serializedState ? JSON.parse(serializedState) : undefined;
	} catch (error) {
		console.error('Error loading state from localStorage:', error);
		return undefined;
	}
};

// TODO: Persist this data, see https://docs.pmnd.rs/zustand/integrations/persisting-store-data
const usePuzzleStore = create(devtools(
	immer<State & Actions>((set) => {
		const loadedState = loadStateFromLocalStorage();

		const initialState: State = loadedState || {
			pieces: {},
			pieceGroups: {},
			correctCount: 0,
			audio: {
				volume: 0.05,
				muted: false,
			},
			shouldLoadPositions: false,
		};

		console.log(`state ${loadedState ? '' : 'not '}loaded`);

		if (!loadedState) {
			const randomIndexArray = Array.from({ length: PIECE_COUNT }, (_, index) => index)
				.sort(() => Math.random() - 0.5);

			for (let r = 0; r < ROW_COUNT; r++) {
				for (let c = 0; c < COL_COUNT; c++) {
					const index = randomIndexArray[r * COL_COUNT + c];
					const [cc, rr] = flatIndexToSpiralCoordinates(
						index + (Math.floor(PIECE_COUNT * 0.35)) + 5,
					) || [0, 0];
					const x = cc * PIECE_SIZE * 1.75;
					const y = rr * PIECE_SIZE * 1.75 - PIECE_SIZE * 2;

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

			saveStateToLocalStorage(initialState);
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

				// todo: this errors out sometimes. state.pieceGroups[newGroupKey] is undefined
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
				saveStateToLocalStorage(state);
			}),
			setVolume: (volume) => set((state) => {
				const oldVolume = state.audio.volume;
				console.log(`volume set from ${oldVolume} to ${volume}`);
				state.audio.volume = volume;
				saveStateToLocalStorage(state);
			}),
			setMuted: (muted) => set((state) => {
				state.audio.muted = muted;
				saveStateToLocalStorage(state);
			}),
			saveState: () => set((state) => {
				saveStateToLocalStorage(state);
			}),
		} satisfies State & Actions;
	}),
	{
		store: 'KroniiPuzzle',
		enabled: process.env.NODE_ENV !== 'production',
	},
));

export default usePuzzleStore;
