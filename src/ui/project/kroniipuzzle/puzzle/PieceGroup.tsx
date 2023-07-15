'use client';

import { Container } from '@pixi/react';

interface PieceGroupProps {
	groupKey: string;
	pieces: Record<string, JSX.Element>;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function PieceGroup({ groupKey, pieces }: PieceGroupProps) {
	return (
		<Container
			eventMode="static"
		>
			{/* */}
		</Container>
	);
}
