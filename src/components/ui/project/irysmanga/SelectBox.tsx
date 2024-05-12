import { useMangaContext } from './context/MangaContext';
import { handlePageNavigation } from './utils/helper';

interface SelectBoxProps {
	value: number;
	label: string;
}

function SelectBox({ value, label }: SelectBoxProps) {
	const {
		setPage, chapter, setChapter, manga, singlePageMode,
	} = useMangaContext();
	/* eslint-disable */
    let maxValue =
        label === "Page"
            ? manga.chapters[chapter].pageCount
            : manga.chapterCount;
    // eslint-enable
    function handleSelectValue(selectedValue: number) {
        const maxChapterCount = manga.chapterCount - 1;
        if (label === "Page") {
            handlePageNavigation(
                selectedValue,
                singlePageMode,
                setPage,
                setChapter,
                chapter,
                manga
            );
            return;
        }
        if (selectedValue >= 0 && selectedValue <= maxChapterCount) {
            setPage(0);
            setChapter(selectedValue);
        }
    }
    return (
        <div className="flex justify-center w-full gap-2">
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
                onChange={(e) =>
                    handleSelectValue(parseInt(e.target.value, 10))
                }
            >
                {Array.from({ length: maxValue }, (_, index) => (
                    <option key={label + index.toString()} value={index}>
                        {label} {index + 1}
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
