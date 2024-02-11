import React, { useRef, useState } from 'react';
import { Container as PixiContainer, FederatedPointerEvent } from 'pixi.js';
import { Container, Graphics, Sprite } from '@pixi/react';

interface Props {
	setShowPreview(value: boolean): void;
}

export default function PuzzlePreview({
	setShowPreview,
}: Props) {
	const [dragging, setDragging] = useState(false);
	const [dragStartPosition, setDragStartPosition] = useState<{ x: number; y:number } | null>(null);
	const [currentPosition, setCurrentPosition] = useState({ x: 0, y: 0 });
	const [parent, setParent] = useState(null as any);

	const containerRef = useRef<PixiContainer>(null);
	const handleDragStart = (event: FederatedPointerEvent) => {
		if (dragging) return;

		const tempParent = event.target!.parent!;
		if (tempParent != null) {
			setParent(tempParent);
		}
		setDragStartPosition(containerRef.current!.toLocal(event.global));
		setDragging(true);
	};

	const handleDragMove = (event: FederatedPointerEvent) => {
		if (!dragging) {
			return;
		}

		const { x, y } = event.getLocalPosition(parent);

		setCurrentPosition({ x: x - dragStartPosition!.x, y: y - dragStartPosition!.y });
	};

	const handleDragEnd = (event: FederatedPointerEvent) => {
		if (!dragging) {
			return;
		}

		const { x, y } = event.getLocalPosition(parent);

		setCurrentPosition({ x: x - dragStartPosition!.x, y: y - dragStartPosition!.y });

		setDragging(false);
	};

	return (
		<Container
			x={currentPosition.x}
			y={currentPosition.y}
			eventMode="static"
			onpointerdown={handleDragStart}
			onpointermove={handleDragMove}
			onglobalpointermove={handleDragMove}
			onpointerup={handleDragEnd}
			onpointerupoutside={handleDragEnd}
			touchstart={handleDragEnd}
			touchmove={handleDragEnd}
			touchend={handleDragEnd}
			touchendoutside={handleDragEnd}
			ref={containerRef}
		>
			<Graphics
				draw={(g) => {
					g.clear();
					g.beginFill(0x001E47);
					g.lineStyle(1, 0xffffff);
					g.drawRoundedRect(0, 0, 450, 268, 8);
					g.endFill();
				}}
			/>
			<Sprite
				image="https://cdn.holoen.fans/hefw/assets/kroniipuzzle/puzzle.webp"
				x={8}
				y={41}
				width={434}
				height={217}
			/>
			<Sprite
				image="https://cdn.holoen.fans/hefw/assets/kroniipuzzle/x-mark.svg"
				x={418}
				y={8}
				width={24}
				height={24}
				eventMode="static"
				onclick={() => setShowPreview(false)}
				cursor="pointer"
			/>

			<Sprite
				image="https://cdn.holoen.fans/hefw/assets/kroniipuzzle/pop.svg"
				x={386}
				y={8}
				width={24}
				height={24}
				eventMode="static"
				onclick={() => window.open('https://cdn.holoen.fans/hefw/assets/kroniipuzzle/puzzle.webp', '_blank', 'noopener')}
				cursor="pointer"
			/>

		</Container>
	);
}
