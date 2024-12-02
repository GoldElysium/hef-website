'use client';

import { createContext } from 'react';
import { PuzzleStore } from './PuzzleStore';

const PuzzleStoreContext = createContext<PuzzleStore | null>(null);

export default PuzzleStoreContext;
