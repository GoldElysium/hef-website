import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { ScrollBox } from '@pixi/ui';
import { extend } from '@pixi/react';
import { Container, Text } from 'pixi.js';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import InteractiveText from '../../util/InteractiveText';

const loadCSV = async (url: string) => {
	const response = await fetch(url);
	return response.text();
};

const csvToJson = (csvString: string) => {
	const lines = csvString.trim().split('\n');
	const headers = lines[0].split('\t');
	const result = [];

	for (let i = 1; i < lines.length; i++) {
		const obj: any = {};
		const currentLine = lines[i].split('\t');
		for (let j = 0; j < headers.length; j++) {
			obj[headers[j].trim()] = currentLine[j] ? currentLine[j].trim() : '';
		}
		result.push(obj);
	}
	return result;
};

extend({ ScrollBox });

interface PixiScrollBoxProps {
	width: number;
	data: any[];
}

function PixiScrollBox({ width, data }: PixiScrollBoxProps) {
	const [scrollBox, setScrollBox] = useState<ScrollBox | null>(null);
	const containerRef = useRef<Container | null>(null);

	useEffect(() => {
		if (!scrollBox) {
			const newScrollBox = new ScrollBox({
				background: 0x000000,
				width: width - 50,
				height: 500,
				type: 'bidirectional',
				elementsMargin: 10,
			});

			data.forEach((item) => {
				const text = new Text(
					JSON.stringify(item, null, 2),
					{
						fontFamily: 'Arial',
						fontSize: 14,
						fill: 0xffffff,
					},
				);

				newScrollBox.addItem(text);
			});

			setScrollBox(newScrollBox);
		}
		if (containerRef.current && scrollBox) {
			containerRef.current.addChild(scrollBox);
		}
	}, [width, data, scrollBox]);

	return (
		<pixiContainer
			ref={containerRef}
			x={50}
			y={250}
		/>
	);
}

interface FishDataProps {
	width: number;
}
function FishData({
	width,
}: FishDataProps) {
	const navigate = useNavigate();

	const [data, setData] = useState<any[] | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | unknown | null>(null);

	interface FishData {
		fishName: string;
		scientificName: string;
		type: string;
		averageLenght: string;
		averageWeight: string;
		catchMethod: string;
		catchQuote: string;
		fishDescription: string;
		habitat: string;
		population: string;
		pricePerPound: string;
		gameRarity: string;
	}
	interface PersistentStore {
		items: FishData[];
		addItems: (item: Record<string, FishData>) => void;
		resetItems: () => void;
	}

	const usePersistentStore = create<PersistentStore>(
		persist(
			(set) => ({
				addItems: (newItems: Record<string, FishData>) => set({ items: newItems }),
			}),
			{
				name: 'Kronii fishing game',
				storage: createJSONStorage(() => localStorage),
			},
		) as any,
	);

	const { addItems } = usePersistentStore();

	useEffect(() => {
		async function fetchData() {
			try {
				const csvText = await loadCSV('/assets/kroniifishing/test-data.tsv');

				const jsonData = csvToJson(csvText);

				setData(jsonData);

				// indexing
				const fishes: Record<string, FishData> = {};

				jsonData?.forEach((fishObject) => {
					const fishData: FishData = {
						fishName: fishObject['Fish Name'],
						scientificName: fishObject['Scientific Name'],
						type: fishObject.Type,
						averageLenght: fishObject['Average Length (ft)'],
						averageWeight: fishObject['Average Weight (lb)'],
						catchMethod: fishObject['Catch Method'],
						catchQuote: fishObject['Catch Quote'],
						fishDescription: fishObject['Fish Description'],
						habitat: fishObject.Habitat,
						population: fishObject.Population,
						pricePerPound: fishObject['Price Per lb (usd)'],
						gameRarity: fishObject['Proposed Game Rarity'],
					};
					console.log('Processing fish: ', fishObject['Fish Name'], fishData);
					fishes[fishObject['Fish Name']] = fishData;
				});

				addItems(fishes);
			} catch (e: Error | unknown | null) {
				setError(e);
			} finally {
				setLoading(false);
			}
		}
		fetchData();
	}, [addItems]);

	const errorOrSuccess = error
		? (
			<pixiText
				text={`Error: ${(error as Error).message}`}
			/>
		)
		: (
			<PixiScrollBox
				width={width}
				data={data as any[]}
			/>
		);

	return (
		<pixiContainer>
			<pixiText
				text="FishData"
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
			{
				loading
					? (
						<pixiText
							text="Loading..."
						/>
					)
					: errorOrSuccess
			}
		</pixiContainer>
	);
}

export default FishData;
