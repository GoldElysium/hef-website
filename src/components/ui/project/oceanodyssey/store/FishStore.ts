/* eslint-disable no-param-reassign */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { FishData } from '../model/FishData';

export interface State {
	fishes: FishData[];
}

export interface Actions {
	setFishes: (newFishes: FishData[]) => void;
	resetFishes: () => void;
}

export type FishStore = ReturnType<typeof useFishStore>;

// TODO: Most likely needs to be updated to use createWithEqualityFn (see jigsaw game and docs)
const useFishStore = create(
	persist(
		immer<State & Actions>((set) => ({
			fishes: [],
			setFishes: (newFishes) => set((state) => {
				state.fishes = newFishes;
			}),
			resetFishes: () => set((state) => {
				state.fishes = [];
			}),
		} satisfies State & Actions)),
		{
			name: 'ocean-odyssey',
		},
	),
);

export default useFishStore;
