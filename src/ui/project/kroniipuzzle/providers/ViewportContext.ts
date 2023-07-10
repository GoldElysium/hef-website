'use client';

import { createContext } from 'react';

interface IViewportContext {
	disableDragging: boolean;
	setDisableDragging: (val: boolean) => void;
}

const ViewportContext = createContext<IViewportContext>({
	disableDragging: false,
	setDisableDragging: () => {},
});
export default ViewportContext;
