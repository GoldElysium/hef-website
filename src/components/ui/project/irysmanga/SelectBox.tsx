import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import useTranslation from '@/lib/i18n/client';
import Select from 'react-select';
import { useState } from 'react';
import classNames from 'classnames';
import { useMangaContext } from './context/MangaContext';
import { handlePageNavigation } from './utils/helper';
import { getMangaDataOrThrow } from './utils/types';

interface SelectBoxProps {
	value: number;
	label: 'page' | 'chapter';
}

function SelectBox({ value, label }: SelectBoxProps) {
	const { t } = useTranslation('reader');
	const {
		language, setPage, chapter, setChapter, manga, pageLayout,
	} = useMangaContext();
	const mangaData = getMangaDataOrThrow(manga, language);

	/* eslint-disable */
    let maxValue =
        label === "page"
            ? mangaData.chapters[chapter].pageCount
            : mangaData.chapterCount;
    // eslint-enable

    function handleSelectValue(selectedValue: number) {
        const maxChapterIndex = mangaData.chapterCount - 1;
        if (label === "page") {
            handlePageNavigation(
                selectedValue,
                pageLayout,
                setPage,
                setChapter,
                chapter,
                language,
                manga
            );
            return;
        }
        if (selectedValue >= 0 && selectedValue <= maxChapterIndex) {
            setPage(0);
            setChapter(selectedValue);
        }
    }

    let labelList: string[] = [];
    if (label === "chapter") {
        labelList = Array.from(Array(maxValue).keys()).map((key) =>
            mangaData.chapters[key].title
                ? mangaData.chapters[key].title
                : `${t(label)} ${key + 1}`
        );
    } else {
        labelList = Array.from(Array(maxValue).keys()).map(
            (key) => `${t(label)} ${key + 1}`
        );
    }
    const options = labelList.map((item, index) => ({
        value: index.toString(),
        label: item,
    }));

    const [open, setOpen] = useState(false);

    return (
        <div className="flex justify-center w-full gap-2">
            <button
                className="btn"
                aria-label="left-page"
                type="button"
                onClick={() => handleSelectValue(value - 1)}
            >
                <ChevronLeftIcon width={20} />
            </button>

            <div className="grow h-full" onClick={() => setOpen(!open)}>
                <Select
                    value={options[value]}
                    onChange={(selectedOption) =>
                        handleSelectValue(parseInt(selectedOption!.value, 10))
                    }
                    unstyled
                    options={options}
                    isSearchable={false}
                    onBlur={() => setOpen(false)}
                    menuIsOpen
                    classNamePrefix={"react-select"}
                    className="h-full w-full"
                    classNames={{
                        control: () =>
                            "rounded-md w-full h-full px-2 hover:cursor-pointer border border-1",
                        singleValue: () => "",
                        menu: () =>
                            classNames(
                                "mt-2 p-1 bg-base-100 border rounded-md transition-all duration-100 ease-in-out",
                                {
                                    "opacity-100 visible": open,
                                    "opacity-0 invisible": !open,
                                }
                            ),
                        menuList: () => "select-scroll",
                        option: ({ isFocused, isSelected }) =>
                            classNames(
                                "hover:cursor-pointer p-2 font-sm rounded",
                                {
                                    "bg-neutral ": isFocused,
                                    "bg-primary": isSelected,
                                }
                            ),
                    }}
                    // styles={selectStyles(open)}
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
