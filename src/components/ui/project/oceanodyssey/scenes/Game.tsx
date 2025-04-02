import { useNavigate } from 'react-router-dom';
import { useExtend, useTick } from '@pixi/react';
import {
	Bounds, Container, Graphics, Rectangle,
} from 'pixi.js';
import {
	forwardRef, useEffect, useRef, useState,
} from 'react';
import InteractiveText from '../../util/InteractiveText';

interface GameProps {
	width: number;
	height: number;
}

// TODO add background image

interface GameBackgroundProps {
	position: { x: number, y: number };
	children: React.ReactNode;
}

function GameBackground({ position, children }: GameBackgroundProps) {
	useExtend({ Container });

	return <pixiContainer x={position.x} y={position.y}>{children}</pixiContainer>;
}

interface FishingSpotProps {
	screenWidth: number;
	screenHeight: number;
}

// fishing spot object test. The circle appears out of the player's LoS (the screen)
// and it'll start appearing once the player gets close to the circle's position.
// Added as a child of gameBackground container, so it will move along with it
// For now, as an unwanted behaviour, it might be loaded and drawn at all times
const FishingSpot = forwardRef<Graphics, FishingSpotProps>(
	({ screenWidth, screenHeight }, ref) => {
		const drawShape = (graphics: Graphics) => {
			graphics.clear();
			graphics.circle(0, 0, 50);
			graphics.fill(0x000000);
		};

		return <pixiGraphics x={screenWidth - 200} y={screenHeight / 2} ref={ref} draw={drawShape} />;
	},
);

FishingSpot.displayName = 'FishingSpot';

interface PositionTextProps {
	text: string;
}

function PositionText({ text }: PositionTextProps) {
	return (
		<pixiText
			text={text}
			style={{
				fontFamily: 'Arial',
				fontSize: 20,
				fill: 0xffffff,
				align: 'left',
			}}
			anchor={0.5}
			x={325}
			y={25}
		/>
	);
}

interface KroniiBodyProps {
	position: { x: number, y: number };
	children: React.ReactNode;
}

const KroniiBody = forwardRef<Graphics, KroniiBodyProps>(({ position, children }, ref) => {
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
		>
			{children}
		</pixiGraphics>
	);
});
KroniiBody.displayName = 'KroniiBody';

interface FishingTextProps {
	x: number;
}

// text that appears once the player is inside a fishing spot bounds
function FishingText({ x }: FishingTextProps) {
	return (
		<pixiText
			text="Fish!"
			style={{
				fontFamily: 'Arial',
				fontSize: 30,
				fill: 0xffffff,
				align: 'center',
			}}
			anchor={0.5}
			x={x}
			y={-10}
		/>
	);
}

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

function Game({
	width,
	height,
}: GameProps) {
	const navigate = useNavigate();

	const kroniiBodyRef = useRef<Graphics | null>(null);
	const [kroniiBodyBounds, setKroniiBodyBounds] = useState<Bounds | null>(null);

	const fishingSpotRef = useRef<Graphics | null>(null);
	const [fishingSpotBounds, setFishingSpotBounds] = useState<Bounds | null>(null);

	const [isInventoryVisible, setIsInventoryVisible] = useState(false);
	const [isFishingTextVisible, setIsFishingTextVisible] = useState(false);
	const [startTime, setStartTime] = useState(0);
	const [animationCooldown, setAnimationCooldown] = useState(false);
	const { playerWidth, playerHeight } = { playerWidth: 80, playerHeight: 160 };
	const playerPosition = { x: (width / 2) - playerWidth / 2, y: (height / 2) - playerHeight / 2 };
	const [gameBackgroundPosition, setGameBackgroundPosition] = useState({ x: 0, y: 0 });
	const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());

	const [positionText, setPositionText] = useState('Pos - X: 0, Y: 0');

	const [inventoryContainerX, setInventoryContainerX] = useState(width);

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

		// Add event listener for keydown
		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('keyup', handleKeyUp);

		// Clean up the event listener on unmount
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
			window.removeEventListener('keyup', handleKeyUp);
		};
	}, []);

	const fishingActionAvailable = () => {
		// function to check if the player is inside a fishing spot bounds, to enable
		// the fishing minigame
		// TODO set all fishing spots of the map
		// TODO add fishing spots (array?) as parameter
		// Store coordinates of both the player and the fishing spot
		const playerBounds = kroniiBodyBounds ?? new Rectangle();
		const newFishingSpotBounds = fishingSpotBounds ?? new Rectangle();
		// calculate distance from the player to the fishing spot
		const distX = Math.abs(
			playerBounds.x + playerBounds.width / 2
      - newFishingSpotBounds.x - newFishingSpotBounds.width / 2,
		);
		const distY = Math.abs(
			playerBounds.y + playerBounds.height / 2
      - newFishingSpotBounds.y - newFishingSpotBounds.height / 2,
		);
		// Pythagoras theorem
		const distance = Math.sqrt(distX * distX + distY * distY);
		// We simulate that the kroniiBody has a "radius" and set the distance in which
		// both figures touch
		const contactDistance = (Math.min(playerBounds.width, playerBounds.height) / 2)
      + newFishingSpotBounds.width / 2;

		return distance < contactDistance;
	};

	const animateInventory = () => {
		// TODO Fix cooldown and hiding animation
		const elapsedTime = (Date.now() - startTime) / 1000; // time in seconds
		const targetX = isInventoryVisible ? width * 0.85 : width;

		if (elapsedTime < 0.5) {
			setInventoryContainerX(width + (targetX - width) * (elapsedTime / 0.5));
		} else {
			setInventoryContainerX(targetX);
		}
	};

	const movePlayer = () => {
		const moveSpeed = 5;
		let moveX = 0;
		let moveY = 0;

		// Check for horizontal movement (A or D)
		if (pressedKeys.has('a')) {
			moveX = moveSpeed; // Move left
		}
		if (pressedKeys.has('d')) {
			moveX = -moveSpeed; // Move right
		}

		// Check for vertical movement (W or S)
		if (pressedKeys.has('w')) {
			moveY = moveSpeed; // Move up
		}
		if (pressedKeys.has('s')) {
			moveY = -moveSpeed; // Move down
		}

		// Update the position based on the active keys
		if (moveX !== 0 || moveY !== 0) {
			setGameBackgroundPosition((prev) => ({
				x: prev.x + moveX,
				y: prev.y + moveY,
			}));
		}

		setIsFishingTextVisible(fishingActionAvailable());
		setPositionText(`Pos - X: ${gameBackgroundPosition.x}, Y: ${gameBackgroundPosition.y}`);
	};

	useTick(() => {
		if (kroniiBodyRef.current) {
			setKroniiBodyBounds(kroniiBodyRef.current.getBounds());
		}

		if (fishingSpotRef.current) {
			setFishingSpotBounds(fishingSpotRef.current.getBounds());
		}

		movePlayer();

		if (pressedKeys.has('e') && !animationCooldown) {
			setIsInventoryVisible(!isInventoryVisible);

			setStartTime(Date.now());

			setAnimationCooldown(true);

			setTimeout(() => {
				setAnimationCooldown(false);
			}, 1000);
		}
	});

	useTick(isInventoryVisible ? animateInventory : () => {});

	return (
		<>
			<pixiText
				text="Game"
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
			<InteractiveText
				label="spam"
				x={width - 200}
				y={100}
				textColor={0x466494}
				onClick={() => navigate('/spam')}
			/>

			<pixiContainer>

				<GameBackground
					position={gameBackgroundPosition}
				>
					<FishingSpot
						ref={fishingSpotRef}
						screenWidth={width}
						screenHeight={height}
					/>
				</GameBackground>

				<PositionText
					text={positionText}
				/>

				<KroniiBody
					ref={kroniiBodyRef}
					position={playerPosition}
				>
					{
						isFishingTextVisible
							? (
								<FishingText
									x={40}
								/>
							)
							: null
					}

				</KroniiBody>

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
			</pixiContainer>
		</>
	);
}

export default Game;
