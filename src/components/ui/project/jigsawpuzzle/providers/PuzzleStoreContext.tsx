'use client';

import { createContext } from 'react';
import { PuzzleStore } from '../puzzle/PuzzleStore';

const PuzzleStoreContext = createContext<PuzzleStore | null>(null);

export default PuzzleStoreContext;
