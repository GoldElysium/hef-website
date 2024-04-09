import { MangaInfo } from './utils/types';

interface SelectBoxProps {
	value: number;
	label: string;
	maxValue: number;
	manga: MangaInfo;
	currentChapterValue: number;
	pageSetFunction: React.Dispatch<React.SetStateAction<number>>;
	chapterSetFunction: React.Dispatch<React.SetStateAction<number>>;
}

function SelectBox({
	value,
	label,
	maxValue,
	manga,
	currentChapterValue,
	pageSetFunction,
	chapterSetFunction,
}: SelectBoxProps) {
	function handleSelectValue(selectedValue: number) {
		const maxPageValue = manga.chapters[currentChapterValue].pageCount - 1;
		const maxChapterValue = manga.chapterCount - 1;
		if (label === 'Page') {
			if (
				selectedValue < 0
                && currentChapterValue > 0
                && currentChapterValue <= maxChapterValue
			) {
				pageSetFunction(
					manga.chapters[currentChapterValue - 1].pageCount - 1,
				);
				chapterSetFunction((prev) => prev - 1);
				return;
			}
			if (
				selectedValue > maxPageValue
                && currentChapterValue >= 0
                && currentChapterValue < maxChapterValue
			) {
				pageSetFunction(0);
				chapterSetFunction((prev) => prev + 1);
				return;
			}
			if (selectedValue >= 0 && selectedValue <= maxPageValue) {
				pageSetFunction(selectedValue);
				return;
			}
		}
		if (selectedValue >= 0 && selectedValue <= maxChapterValue) {
			pageSetFunction(0);
			chapterSetFunction(selectedValue);
		}
	}
	return (
		<div className="flex w-full justify-center">
			<button
				className="btn"
				aria-label="left-page"
				type="button"
				onClick={() => handleSelectValue(value - 1)}
			>
				<img src="/assets/irysmanga/left.svg" width={20} alt="" />
			</button>
			<select
				value={value}
				className="select grow"
				onChange={(e) => handleSelectValue(parseInt(e.target.value, 10))}
			>
				{Array.from({ length: maxValue }, (_, index) => (
					<option key={label + index.toString()} value={index}>
						{label}
						{' '}
						{index + 1}
					</option>
				))}
			</select>
			<button
				className="btn"
				aria-label="right-page"
				type="button"
				onClick={() => handleSelectValue(value + 1)}
			>
				<img src="/assets/irysmanga/right.svg" width={20} alt="" />
			</button>
		</div>
	);
}

export default SelectBox;
