import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import useTranslation from '@/lib/i18n/client';
import { useMangaContext } from './context/MangaContext';
import { handlePageNavigation } from './utils/helper';

interface SelectBoxProps {
	value: number;
	label: 'page' | 'chapter';
}

function SelectBox({ value, label }: SelectBoxProps) {
	const { t } = useTranslation('reader');
	const {
		setPage, chapter, setChapter, manga, singlePageMode,
	} = useMangaContext();

	/* eslint-disable */
    let maxValue =
        label === "page"
            ? manga.chapters[chapter].pageCount
            : manga.chapterCount;
    // eslint-enable

    function handleSelectValue(selectedValue: number) {
        const maxChapterIndex = manga.chapterCount - 1;
        if (label === "page") {
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
        if (selectedValue >= 0 && selectedValue <= maxChapterIndex) {
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
                <ChevronLeftIcon width={20} />
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
                        {t(label)} {index + 1}
                    </option>
                ))}
            </select>
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
