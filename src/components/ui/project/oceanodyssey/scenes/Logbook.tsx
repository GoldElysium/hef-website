import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ArrowLeftIcon } from '@heroicons/react/20/solid';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
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
			className="relative w-6/12 aspect-[1/sqrt(2)] bg-gray-600 flex flex-col p-6 border-2 border-white overflow-y-auto min-h-full"
		>
			<h2 className="text-2xl">{fish.name}</h2>
			<br className="my-1 w-full" />
			<p className="text-1xl text-left">{fish.description}</p>
		</div>
	);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface LogbookProps {
	backgroundColor: string;
}

export default function Logbook() {
	const navigate = useNavigate();

	const [index, setIndex] = useState(0);

	const { fishes } = useFishStore();

	const fishContents: FishContent[] = Object.values(fishes).map((fish) => ({
		name: fish.fishName,
		numCaught: 0,
		price: Math.floor(Math.random() * (10 - 5 + 1)) + 5,
		pictureUrl: 'a.jpg',
		description: fish.description,
		kind: 'Fish',
	} as FishContent));

	return (
		<div
			className="grid place-items-center font-[Arial] min-h-screen bg-skin-background-dark p-8"
		>
			<div>
				<div>
					<button
						type="button"
						onClick={() => navigate(-1)}
						className="bg-[#2E75B5] text-white px-6 py-4 text-lg cursor-pointer"
					>
						Back
					</button>
				</div>
				<h1 className="text-center text-4xl font-bold">
					Logbook
				</h1>

				<div
					className="text-center font-bold mt-16 relative flex gap-8 items-center"
				>
					<button
						type="button"
						onClick={() => {
							setIndex(Math.max(0, index - 2));
						}}
						className="cursor-pointer p-4 bg-[#2E75B5] rounded-full"
					>
						<ArrowLeftIcon className="size-6" />
					</button>
					<div className="grid place-items-center w-full">
						<div
							className="flex relative w-[70rem] min-[160rem]:w-[96rem] aspect-[2/sqrt(2)]"
						>
							<Page
								fish={fishContents[index]}
							/>
							{index + 1 < fishContents.length ? (
								<Page
									fish={fishContents[index + 1]}
								/>
							) : null}
						</div>
					</div>
					<button
						type="button"
						onClick={() => {
							setIndex(Math.min(fishContents.length - 1, index + 2));
						}}
						className="cursor-pointer p-4 bg-[#2E75B5] rounded-full"
					>
						<ArrowRightIcon className="size-6" />
					</button>
				</div>
			</div>
		</div>
	);
}
