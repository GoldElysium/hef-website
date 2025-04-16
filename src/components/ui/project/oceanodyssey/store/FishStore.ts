import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { FishData } from '../model/FishData';

interface FishDataPersistentStore {
	fishes: FishData[];
	addFishes: (item: Record<string, FishData>) => void;
	resetFishes: () => void;
}

const useFishStore = create<FishDataPersistentStore>(
	persist(
		(set) => ({
			addFishes: (newFishes: Record<string, FishData>) => set({ fishes: newFishes }),
		}),
		{
			name: 'Kronii fishing game',
			storage: createJSONStorage(() => localStorage),
		},
	) as any,
);

export default useFishStore;
