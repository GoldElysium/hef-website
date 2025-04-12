import { useNavigate } from 'react-router-dom';
import { Graphics } from 'pixi.js';
import InteractiveText from '../../util/InteractiveText';

interface Content {
	name: string;
	numCaught: number;
	price: number;
	pictureUrl: string;
	kind: 'Fish' | 'Fishsona';
}

interface FishContent extends Content {
	kind: 'Fish';
	description: string;
}

interface FishsonaContent extends Content {
	kind: 'Fishsona';
	message: string | undefined;
	kronieImageUrl: string;
	signatureUrl: string | undefined;
}

interface LogProps {
	leftRect: { x: number, y: number, width: number, height: number },
	rightRect: { x: number, y: number, width: number, height: number },
	startY: number;
}

function Log({ leftRect, rightRect, startY }: LogProps) {
	const drawShape = (g: Graphics) => {
		g.clear();

		g.rect(leftRect.x, startY, leftRect.width * 2, leftRect.height);
		g.fill(0x0A0AFF);

		g.stroke(0xffffff);
		g.rect(leftRect.y, startY, leftRect.width * 2, leftRect.height);
		g.fill(0x000000, 0);

		g.rect(leftRect.x + leftRect.width, startY, 1, leftRect.height);
		g.fill(0xFFFFFF);

		g.rect(
			leftRect.x * 1.3,
			startY + leftRect.height * 0.15,
			leftRect.width - (leftRect.x * 1.3 - leftRect.x) * 2,
			leftRect.width * 0.4,
		);
		g.fill(0xFFFFFF);

		g.rect(
			rightRect.x + (leftRect.x * 1.3 - leftRect.x),
			startY + leftRect.height * 0.15,
			leftRect.width - (leftRect.x * 1.3 - leftRect.x) * 2,
			rightRect.width * 0.4,
		);
		g.fill(0xFFFFFF);
	};

	return <pixiGraphics draw={drawShape} />;
}

interface CollectiblesProps {
	width: number;
}

function Collectibles({
	width,
}: CollectiblesProps) {
	const navigate = useNavigate();

	const leftRightButtonsY = 150 + width * 0.6 * 0.75 * 0.5;

	const dummyContents: (FishContent | FishsonaContent)[] = [
		{
			name: 'Salmon',
			numCaught: 5,
			price: 6,
			pictureUrl: 'a.jpg',
			description: 'Swims in water.',
			kind: 'Fish',
		},
		{
			name: 'Anonymous Kronie',
			numCaught: 5,
			price: 6,
			pictureUrl: 'dummy-fishsona.jpg',
			kronieImageUrl: 'b.jpg',
			signatureUrl: 'c.jpg',
			kind: 'Fishsona',
		} as FishsonaContent,
	];

	const logWidth = width * 0.6;
	const height = logWidth * 0.8;
	const startY = 200;

	const leftRect = {
		x: logWidth * 0.2,
		y: startY,
		width: logWidth * 0.63,
		height,
	};

	const rightRect = {
		x: leftRect.x + leftRect.width,
		y: leftRect.y,
		width: leftRect.width,
		height: leftRect.height,
	};

	return (
		<pixiContainer>
			<pixiText
				text="Log Book"
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
				label="<"
				x={width * 0.2 - 200}
				y={leftRightButtonsY}
				textColor={0xFFFFFF}
				onClick={() => {}}
			/>

			<InteractiveText
				label=">"
				x={width * 0.6 + width * 0.2}
				y={leftRightButtonsY}
				textColor={0xFFFFFF}
				onClick={() => {}}
			/>

			<Log
				leftRect={leftRect}
				rightRect={rightRect}
				startY={startY}
			/>

			{dummyContents.map((x, i) => {
				const rect = i % 2 === 0 ? leftRect : rightRect;
				const text = (x as FishsonaContent).message ?? (x as FishContent).description;
				return (
					<pixiContainer
						key={x.name}
					>
						<pixiText
							text={x.name}
							x={rect.x + rect.width * 0.5}
							y={startY + leftRect.height * 0.075}
							anchor={0.5}
							style={{
								fill: 'white',
								fontSize: 18,
							}}
						/>
						<pixiText
							text={text}
							x={rect.x + rect.width * 0.5}
							y={startY + leftRect.height * 0.55}
							anchor={1}
							style={{
								fill: 'white',
								fontSize: 12,
							}}
						/>
					</pixiContainer>
				);
			})}
		</pixiContainer>
	);
}

export default Collectibles;
