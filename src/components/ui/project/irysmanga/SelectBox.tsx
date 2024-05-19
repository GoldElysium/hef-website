import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import useTranslation from '@/lib/i18n/client';
import Select from 'react-select';
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

    const customStyles = {
        control: (provided: any, state: any) => ({
            ...provided,
            height: "100%",
            minHeight: "2.5rem",
            borderRadius: "0.375rem",
            borderColor: state.isFocused ? "#7C3AED" : "#E5E7EB",
            boxShadow: state.isFocused
                ? "0 0 0 2px rgba(124, 58, 237, 0.2)"
                : "none",
            "&:hover": {
                borderColor: "#7C3AED",
            },
        }),
        option: (provided: any, state: any) => ({
            ...provided,
            backgroundColor: state.isSelected ? "#7C3AED" : "white",
            color: state.isSelected ? "white" : "black",
            "&:hover": {
                backgroundColor: "#7C3AED",
                color: "white",
            },
        }),
        menu: (provided: any) => ({
            ...provided,
            maxHeight: "200px",
            borderRadius: "0.375rem",
            zIndex: 9999,
        }),
        scrollbarWidth: () => 4,
        scrollbarThumb: (provided: any) => ({
            ...provided,
            backgroundColor: "#7C3AED",
        }),
    };
    // return (
    //     <div className="flex justify-center w-full gap-2">
    //         <button
    //             className="select-box-btn"
    //             aria-label="left-page"
    //             type="button"
    //             onClick={() => handleSelectValue(value - 1)}
    //         >
    //             <ChevronLeftIcon width={20} />
    //         </button>
    //         <select
    //             value={value}
    //             className="select select-bordered select- grow min-w-[100px] select-primary"
    //             onChange={(e) =>
    //                 handleSelectValue(parseInt(e.target.value, 10))
    //             }
    //         >
    //             {Array.from(labelList, (fmtLabel, index) => (
    //                 <option key={label + index.toString()} value={index}>
    //                     {fmtLabel}
    //                 </option>
    //             ))}
    //         </select>
    //         <button
    //             className="select-box-btn"
    //             aria-label="right-page"
    //             type="button"
    //             onClick={() => handleSelectValue(value + 1)}
    //         >
    //             <ChevronRightIcon width={20} />
    //         </button>
    //     </div>
    // );
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

            <Select
                value={options[value]}
                onChange={(selectedOption) =>
                    handleSelectValue(parseInt(selectedOption!.value, 10))
                }
                options={options}
                unstyled
                // styles={customStyles}
                classNamePrefix="react-select"
                className="grow"
                classNames={{
                    control: (state) =>
                        `menu-control ${
                            state.isFocused
                                ? "border-primary"
                                : "border-secondary"
                        }`,
                    option: (state) =>
                        `menu-item  ${
                            state.isSelected
                                ? "bg-primary text-primary-content"
                                : "bg-white"
                        }`,
                }}
            />

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
