import { useNavigate } from 'react-router-dom';
import { useTick } from '@pixi/react';
import { Graphics, Ticker } from 'pixi.js';
import {
	forwardRef, useEffect, useState,
} from 'react';
import InteractiveText from '../../util/InteractiveText';

interface SpamProps {
	width: number;
	height: number;
}

interface KroniiBodyProps {
	position: { x: number, y: number };
}

const KroniiBody = forwardRef<Graphics, KroniiBodyProps>(
	({ position }, ref) => {
		const drawShape = (graphics: Graphics) => {
			graphics.clear();
			graphics.rect(0, 0, 80, 160);
			graphics.fill(0x0000ff);
		};

		return (
			<pixiGraphics
				ref={ref}
				x={position.x}
				y={position.y}
				draw={drawShape}
			/>
		);
	},
);
KroniiBody.displayName = 'KroniiBody';

interface BackpackProps {
	position: { x: number, y: number };
	onClick: () => void;
}

const Backpack = forwardRef<Graphics, BackpackProps>(
	({ position, onClick }, ref) => {
		const drawShape = (graphics: Graphics) => {
			graphics.clear();
			graphics.rect(0, 0, 60, 60);
			graphics.fill(0x5c3e0e);
		};

		return (
			<pixiGraphics
				ref={ref}
				x={position.x}
				y={position.y}
				draw={drawShape}
				onClick={onClick}
				interactive
			/>
		);
	},
);
Backpack.displayName = 'KroniiBody';

interface InventoryBackgroundProps {
	screenWidth: number;
	screenHeight: number;
}

function InventoryBackground({ screenWidth, screenHeight }: InventoryBackgroundProps) {
	const drawShape = (graphics: Graphics) => {
		graphics.clear();
		graphics.rect(0, 0, screenWidth * 0.15, screenHeight);
		graphics.fill(0x0A0AFF);
	};

	return <pixiGraphics draw={drawShape} />;
}

interface InventoryContainerProps {
	x: number;
	screenWidth: number;
	screenHeight: number;
}

// Container for the inventory HUD
function InventoryContainer({ x, screenWidth, screenHeight }: InventoryContainerProps) {
	return (
		<pixiContainer
			x={x}
			y={0}
		>
			<InventoryBackground
				screenWidth={screenWidth}
				screenHeight={screenHeight}
			/>
		</pixiContainer>
	);
}

interface FishingTextProps {
	text: string;
}

function FishingText({ text }: FishingTextProps) {
	return (
		<pixiText
			text={text}
			style={{
				fontFamily: 'Arial',
				fontSize: 24,
				fill: 0xffffff,
			}}
			anchor={0.5}
			x={10}
			y={30}
		/>
	);
}

interface PlayerFishingBarProps {
	height: integer;
}

function PlayerFishingBar({ height }: PlayerFishingBarProps) {
	return (
		<pixiGraphics
			draw={(graphics: Graphics) => {
				graphics.clear();
				graphics.rect(0, 0, 40, height);
				graphics.fill(0x00ff00);
			}}
			angle={180}
		/>
	);
}

interface FishScapeBarProps {
	height: integer;
}

function FishScapeBar({ height }: FishScapeBarProps) {
	return (
		<pixiGraphics
			draw={(graphics: Graphics) => {
				graphics.clear();
				graphics.rect(50, 0, 40, height);
				graphics.fill(0xFF0000);
			}}
			angle={180}
		/>
	);
}

interface FishStatusProps {
	playerFishingBarHeight: integer;
	fishScapeBarHeight: integer;
	fishingText: string;
}

function FishStatus({ playerFishingBarHeight, fishScapeBarHeight, fishingText }: FishStatusProps) {
	return (
		<pixiContainer
			x={200}
			y={200}
		>
			<FishingText
				text={fishingText}
			/>
			<FishScapeBar
				height={fishScapeBarHeight}
			/>
			<PlayerFishingBar
				height={playerFishingBarHeight}
			/>
		</pixiContainer>
	);
}

function Spam({ width, height }: SpamProps) {
	const navigate = useNavigate();
	const [isInventoryVisible, setIsInventoryVisible] = useState(false);
	const [startTime, setStartTime] = useState(0);
	const [animationCooldown, setAnimationCooldown] = useState(false);
	const playerHeight = 160;
	const [playerPosition, setPlayerPosition] = useState(
		{ x: (width / 2) - playerHeight / 2, y: (height / 2) - 200 },
	);
	const [backpackPosition, setBackpackPosition] = useState(
		{ x: (width / 2) + 100, y: (height / 2) - 100 },
	);
	const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
	const [inventoryContainerX, setInventoryContainerX] = useState(width);
	const [isPlayerFishing, setIsPlayerFishing] = useState(false);
	const [playerFishingBarHeight, setPlayerFishingBarHeight] = useState(5);
	const [elapsedTime, setElapsedTime] = useState(0);
	const [playerProgress, setPlayerProgress] = useState(0);
	const [fishProgress, setFishProgress] = useState(0);
	const [fishingText, setFishingText] = useState('Press Q to start fishing');
	const [fishScapeBarHeight, setFishScapeBarHeight] = useState(5);

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			setPressedKeys((prev) => new Set(prev.add(event.key)));
		};

		const handleKeyUp = (event: KeyboardEvent) => {
			setPressedKeys((prev) => {
				const newSet = new Set(prev);
				newSet.delete(event.key);
				return newSet;
			});
		};

		const handlePointerDown = () => {
			if (isPlayerFishing) {
				setPlayerFishingBarHeight(playerFishingBarHeight + 5);
			}
		};

		// Add event listener for keydown
		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('keyup', handleKeyUp);
		window.addEventListener('pointerdown', handlePointerDown);

		// Clean up the event listener on unmount
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
			window.removeEventListener('keyup', handleKeyUp);
			window.removeEventListener('pointerdown', handlePointerDown);
		};
	}, [isPlayerFishing, playerFishingBarHeight]);

	const animateInventory = () => {
		// TODO Fix cooldown and hiding animation
		const elapsedTime2 = (Date.now() - startTime) / 1000; // time in seconds
		const targetX = isInventoryVisible ? width * 0.85 : width;

		if (elapsedTime2 < 0.5) {
			setInventoryContainerX(width + (targetX - width) * (elapsedTime2 / 0.5));
		} else {
			setInventoryContainerX(targetX);
		}
	};

	const movePlayer = () => {
		const moveSpeed = 5;
		let moveX = 0;
		const moveY = 0;

		// Check for horizontal movement (A or D)
		if (pressedKeys.has('a')) {
			moveX = -moveSpeed; // Move left
		}
		if (pressedKeys.has('d')) {
			moveX = moveSpeed; // Move right
		}

		if (pressedKeys.has('e') && !animationCooldown) {
			setIsInventoryVisible(!isInventoryVisible);

			setStartTime(Date.now());

			setAnimationCooldown(true);

			setTimeout(() => {
				setAnimationCooldown(false);
			}, 1000);
		}

		// Update the position based on the active keys
		if (moveX !== 0 || moveY !== 0) {
			setPlayerPosition((prev) => ({
				x: prev.x + moveX,
				y: prev.y + moveY,
			}));
			setBackpackPosition((prev) => ({
				x: prev.x + moveX,
				y: prev.y + moveY,
			}));
		}
	};

	const fishing = (ticker: Ticker) => {
		if (!isPlayerFishing) {
			return;
		}

		setElapsedTime(elapsedTime + ticker.deltaMS / 1000);
		setFishingText(`${fishProgress}% - ${playerProgress}%`);

		if (elapsedTime < 0.25) {
			return;
		}

		const newFishScapeBarHeight = fishScapeBarHeight + 5;

		setFishScapeBarHeight(newFishScapeBarHeight);

		const newPlayerProgress = playerFishingBarHeight;
		const newFishProgress = fishScapeBarHeight;

		setPlayerProgress(newPlayerProgress);
		setFishProgress(newFishProgress);

		setElapsedTime(0);

		if (newPlayerProgress < 100 && newFishProgress < 100) {
			return;
		}

		setFishingText(
			newPlayerProgress >= 100
				? 'Player wins. Press Q to restart'
				: 'Fish scaped. Press Q to restart',
		);

		setFishScapeBarHeight(5);
		setPlayerProgress(0);
		setFishProgress(0);
		setPlayerFishingBarHeight(5);

		setIsPlayerFishing(false);
	};

	useTick((ticker: Ticker) => {
		movePlayer();

		if (pressedKeys.has('q')) {
			setIsPlayerFishing(true);
		}

		fishing(ticker);
	});

	useTick(isInventoryVisible ? animateInventory : () => {});

	return (
		<>
			<pixiText
				text="Spam"
				style={{
					fontFamily: 'Arial',
					fontSize: 50,
					align: 'center',
					fill: 0xffffff,
				}}
				anchor={0.5}
				x={width / 2}
				y={150}
			/>
			<InteractiveText
				label="back"
				x={0}
				y={0}
				textColor={0x466494}
				onClick={() => navigate(-1)}
			/>
			<InteractiveText
				label="shop"
				x={width - 200}
				y={0}
				textColor={0x466494}
				onClick={() => navigate('/shop')}
			/>

			<pixiContainer>

				<KroniiBody
					position={playerPosition}
				/>

				<Backpack
					position={backpackPosition}
					onClick={() => { setIsInventoryVisible(!isInventoryVisible); }}
				/>

				{
					isInventoryVisible
						? (
							<InventoryContainer
								x={inventoryContainerX}
								screenWidth={width}
								screenHeight={height}
							/>
						)
						: null
				}

				<FishStatus
					playerFishingBarHeight={playerFishingBarHeight}
					fishScapeBarHeight={fishScapeBarHeight}
					fishingText={fishingText}
				/>

			</pixiContainer>
		</>
	);
}

export default Spam;
