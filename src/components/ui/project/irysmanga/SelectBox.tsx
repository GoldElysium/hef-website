import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import useTranslation from '@/lib/i18n/client';
import Select from 'react-select';
import { useState } from 'react';
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

    const selectStyles = (open: any) => ({
        singleValue: (base: any) => ({ ...base, color: "#666" }),
        menu: (base: any) => ({
            ...base,
            marginTop: 0,
            borderwidth: 10,
            fontSize: 12,
            overflow: "hidden",
            opacity: open ? 1 : 0,
            transition: "all 0.1s ease-in-out",
            visibility: open ? "visible" : "hidden",
        }),
        menuList: (base: any) => ({
            "::-webkit-scrollbar": {
                width: "4px",
                height: "0px",
            },
            "::-webkit-scrollbar-track": {
                background: "#f1f1f1",
            },
            "::-webkit-scrollbar-thumb": {
                background: "#888",
            },
            "::-webkit-scrollbar-thumb:hover": {
                background: "#555",
            },
        }),
        container: (base: any) => ({
            ...base,
            height: "100%",
        }),
        control: (base: any) => ({
            ...base,
            height: "100%",
        }),
        option: (base: any, state: any) => ({
            ...base,
            fontSize: "0.9rem",
        }),
    });
    const [open, setOpen] = useState(false);

    return (
        <div className="flex justify-center w-full gap-2">
            <button
                className="select-box-btn"
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
                    options={options}
                    isSearchable={false}
                    onBlur={() => setOpen(false)}
                    menuIsOpen
                    classNamePrefix={"react-select"}
                    className="h-full w-full"
                    styles={selectStyles(open)}
                />
            </div>

            <button
                className="select-box-btn"
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
