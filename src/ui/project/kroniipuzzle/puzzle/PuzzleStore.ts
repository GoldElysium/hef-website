/* eslint-disable no-param-reassign */
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { devtools } from 'zustand/middleware';
import { COL_COUNT, PIECE_SIZE, ROW_COUNT } from './PuzzleConfig';

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
		};
	}
	correctCount: number;
}

interface Actions {
	updatePiecePosition: (key: string) => (newPosition: { x: number; y:number; }) => void;
	updatePieceLocalPosition: (key: string, newPosition: { x: number; y:number; }) => void;
	updatePieceGroupPosition: (key: string) => (newPosition: { x: number; y:number; }) => void;
	// eslint-disable-next-line max-len
	changePieceGroup: (key: string) => (newGroupKey: string, positionData: Record<string, { x: number; y:number; }>) => void;
	setCorrect: (key: string) => () => void;
}

// TODO: Persist this data, see https://docs.pmnd.rs/zustand/integrations/persisting-store-data
const usePuzzleStore = create(devtools(
	immer<State & Actions>((set) => {
		const initialState: State = {
			pieces: {},
			pieceGroups: {},
			correctCount: 0,
		};

		for (let r = 0; r < ROW_COUNT; r++) {
			for (let c = 0; c < COL_COUNT; c++) {
				initialState.pieces[`${r}-${c}`] = {
					position: {
						x: -1000,
						y: -1000,
					},
					localPosition: {
						x: 0,
						y: 0,
					},
					pieceGroup: `${r}-${c}`,
				};
				initialState.pieceGroups[`${r}-${c}`] = {
					position: {
						x: -1000,
						y: -1000,
					},
					targetPosition: {
						x: c * PIECE_SIZE,
						y: r * PIECE_SIZE,
					},
					pieces: [`${r}-${c}`],
					correct: false,
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
				state.pieceGroups[key].position = newPos;
			}),
			changePieceGroup: (key) => (newGroupKey, positionData) => set((state) => {
				const oldGroupKey = state.pieces[key].pieceGroup;
				const oldGroup = state.pieceGroups[oldGroupKey].pieces;

				// eslint-disable-next-line no-restricted-syntax
				for (const pieceKey of oldGroup) {
					state.pieces[pieceKey].pieceGroup = newGroupKey;
					state.pieces[pieceKey].localPosition = positionData[pieceKey];
				}

				// Merge everything into the other group and delete the old group
				state.pieceGroups[newGroupKey].pieces.push(...state.pieceGroups[oldGroupKey].pieces);
				delete state.pieceGroups[oldGroupKey];
			}),
			setCorrect: (key) => () => set((state) => {
				state.pieceGroups[key].correct = true;
				state.correctCount += state.pieceGroups[key].pieces.length;
			}),
		} satisfies State & Actions;
	}),
	{
		store: 'KroniiPuzzle',
		enabled: process.env.NODE_ENV !== 'production',
	},
));

export default usePuzzleStore;
