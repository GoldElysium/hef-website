import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import useFishStore from '../store/FishStore';

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

interface PageProps {
	fish: FishContent;
}

function Page({ fish }: PageProps) {
	return (
		<div
			style={{
				position: 'relative',
				width: '50%',
				aspectRatio: '2 / 3',
				border: '0.125vw solid white',
				backgroundColor: 'blue',
				boxSizing: 'border-box',
				display: 'flex',
				flexDirection: 'column',
				padding: '1vw',
			}}
		>
			<h2 className="text-2xl">{fish.name}</h2>
			<div />
			<p className="text-1xl">{fish.description}</p>
		</div>
	);
}

interface CollectiblesProps {
	backgroundColor: string;
}

function Collectibles({
	backgroundColor,
}: CollectiblesProps) {
	const navigate = useNavigate();

	const [index, setIndex] = useState(0);

	const { fishes } = useFishStore();

	const fishContents: FishContent[] = Object.values(fishes).map((fish) => ({
		name: fish.fishName,
		numCaught: 0,
		price: Math.floor(Math.random() * (10 - 5 + 1)) + 5,
		pictureUrl: 'a.jpg',
		description: fish.fishDescription,
		kind: 'Fish',
	} as FishContent));

	return (
		<div
			style={{
				position: 'fixed',
				display: 'flex',
				flexDirection: 'column',
				gap: '1rem',
				justifyContent: 'normal',
				alignContent: 'center',
				fontFamily: 'Arial, sans-serif',
				top: 0,
				left: 0,
				width: '100vw',
				height: '100vh',
				backgroundColor,
				padding: '10vw',
			}}
		>
			<div>
				<button
					type="button"
					onClick={() => navigate(-1)}
					style={{
						cursor: 'pointer',
					}}
				>
					Back
				</button>
			</div>
			<h1 className="text-center text-4xl font-bold">
				Log Book
			</h1>

			<div
				className="text-center font-bold"
				style={{
					position: 'relative',
					display: 'flex',
					flexDirection: 'row',
					gap: '2rem',
				}}
			>
				<button
					type="button"
					onClick={() => { setIndex(Math.max(0, index - 1)); }}
					style={{
						cursor: 'pointer',
					}}
				>
					{'<'}
				</button>
				<div
					style={{
						position: 'relative',
						display: 'flex',
						flexDirection: 'row',
						width: '70vw',
						aspectRatio: '4 / 3',
						border: '0.125vw solid white',
						boxSizing: 'border-box',
					}}
				>
					<Page
						fish={fishContents[index]}
					/>
					{index + 1 < fishContents.length
						? (
							<Page
								fish={fishContents[index + 1]}
							/>
						)
						: null}
				</div>
				<button
					type="button"
					onClick={() => { setIndex(Math.min(fishContents.length - 1, index + 1)); }}
					style={{
						cursor: 'pointer',
					}}
				>
					{'>'}
				</button>
			</div>
		</div>
	);
}

export default Collectibles;
