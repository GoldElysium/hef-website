'use client';

import { useContext } from 'react';
import { useStoreWithEqualityFn } from 'zustand/traditional';
import { State, Actions } from '../puzzle/PuzzleStore';
import PuzzleStoreContext from './PuzzleStoreContext';

export default function usePuzzleStore<T>(
	selector: (state: State & Actions) => T,
	equalityFn?: (left: T, right: T) => boolean,
): T {
	const store = useContext(PuzzleStoreContext);
	if (!store) throw new Error('Missing PuzzleStoreProvider in the tree');
	return useStoreWithEqualityFn(store, selector, equalityFn);
}
