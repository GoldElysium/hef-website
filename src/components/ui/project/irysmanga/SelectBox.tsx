import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import Select from 'react-select';
import { useState, useId } from 'react';
import classNames from 'classnames';
import { useMangaContext } from './context/MangaContext';
import { handlePageNavigation } from './utils/helper';
import { getMangaDataOrThrow } from './utils/types';
import useDualTranslation from './hooks/useDualTranslation';

interface SelectBoxProps {
	value: number;
	label: 'page' | 'chapter';
}

function SelectBox({ value, label }: SelectBoxProps) {
	const {
		mangaLanguage, setPage, chapter, setChapter, manga, pageLayout,
	} = useMangaContext();
	const mangaData = getMangaDataOrThrow(manga, mangaLanguage);
	const tManga = useDualTranslation(mangaLanguage);

	const maxValue = (
		label === 'page'
			? mangaData.chapters[chapter].pageCount
			: mangaData.chapterCount
	);

	function handleSelectValue(selectedValue: number) {
		const maxChapterIndex = mangaData.chapterCount - 1;
		if (label === 'page') {
			handlePageNavigation(
				selectedValue,
				pageLayout,
				setPage,
				setChapter,
				chapter,
				mangaLanguage,
				manga,
			);
			return;
		}
		if (selectedValue >= 0 && selectedValue <= maxChapterIndex) {
			setPage(0);
			setChapter(selectedValue);
		}
	}

	let labelList: string[] = [];
	if (label === 'chapter') {
		labelList = Array.from(Array(maxValue).keys()).map((key) => (mangaData.chapters[key].title
			? mangaData.chapters[key].title
			: `${tManga(label)} ${key + 1}`));
	} else {
		labelList = Array.from(Array(maxValue).keys()).map(
			(key) => `${tManga(label)} ${key + 1}`,
		);
	}
	const options = labelList.map((item, index) => ({
		value: index.toString(),
		label: item,
	}));

	const [open, setOpen] = useState(false);

	return (
		<div className="flex w-full justify-center gap-2">
			<button
				className="btn"
				aria-label="left-page"
				type="button"
				onClick={() => handleSelectValue(value - 1)}
			>
				<ChevronLeftIcon width={20} />
			</button>

			{/* eslint-disable-next-line max-len */}
			{/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
			<div className="h-full grow" onClick={() => setOpen(!open)}>
				<Select
					value={options[value]}
					onChange={(selectedOption) => handleSelectValue(parseInt(selectedOption!.value, 10))}
					unstyled
					options={options}
					isSearchable={false}
					onBlur={() => setOpen(false)}
					menuIsOpen
					classNamePrefix="react-select"
					className="h-full grow"
					instanceId={useId()}
					classNames={{
						valueContainer: () => 'w-full',
						control: () => 'rounded-md w-full h-full px-2 hover:cursor-pointer bg-base-200 hover:bg-base-300 transition-all',
						singleValue: () => 'w-full truncate',
						menu: () => classNames(
							'mt-2 p-1 bg-base-100 border rounded-md transition-all',
							{
								'opacity-100 visible': open,
								'opacity-0 invisible': !open,
							},
						),
						menuList: () => 'scroll-smooth',
						option: ({ isFocused, isSelected }) => classNames(
							'hover:cursor-pointer p-2 font-sm rounded truncate',
							{
								'bg-neutral text-neutral-content':
                                        isSelected,
								'hover:bg-neutral hover:text-neutral-content':
                                        isFocused,
							},
						),
					}}
				/>
			</div>

			<button
				className="btn"
				aria-label="right-page"
				type="button"
				onClick={() => handleSelectValue(value + 1)}
			>
				<ChevronRightIcon width={20} />
			</button>
		</div>
	);
}

export default SelectBox;
