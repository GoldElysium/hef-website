import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import useTranslation from '@/lib/i18n/client';
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
                className="select grow min-w-[100px]"
                onChange={(e) =>
                    handleSelectValue(parseInt(e.target.value, 10))
                }
            >
                {Array.from(labelList, (fmtLabel, index) => (
                    <option key={label + index.toString()} value={index}>
                        {fmtLabel}
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
