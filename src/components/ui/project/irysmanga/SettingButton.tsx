import React from 'react';
import {
	ArrowsRightLeftIcon,
	DevicePhoneMobileIcon,
	ComputerDesktopIcon,
	ArrowRightIcon,
	ArrowLeftIcon,
	CodeBracketIcon,
	StopIcon,
	WindowIcon,
	SunIcon,
	MoonIcon,
	ArrowsUpDownIcon,
	LanguageIcon,
	Bars2Icon,
	MinusIcon,
} from '@heroicons/react/24/outline';
import useTranslation from '@/lib/i18n/client';
import { ReaderSetting } from './utils/types';
import { getNextOption } from './utils/helper';

interface Props {
	value: ReaderSetting;
	valueList: ReadonlyArray<ReaderSetting>;
	setValue: React.Dispatch<React.SetStateAction<ReaderSetting>>;
	label?: string;
}

type SettingIcons = {
	[key in ReaderSetting]: JSX.Element;
};

const settingIcons: SettingIcons = {
	single: <ArrowsRightLeftIcon className="setting-icon" />,
	long: <ArrowsUpDownIcon className="setting-icon" />,
	height: <DevicePhoneMobileIcon className="setting-icon" />,
	width: <CodeBracketIcon className="setting-icon" />,
	original: <ComputerDesktopIcon className="setting-icon" />,
	ltr: <ArrowRightIcon className="setting-icon" />,
	rtl: <ArrowLeftIcon className="setting-icon" />,
	'header-hidden': <StopIcon className="setting-icon" />,
	'header-shown': <WindowIcon className="setting-icon" />,
	'progress-hidden': <MinusIcon className="setting-icon" />,
	'progress-shown': <Bars2Icon className="setting-icon" />,
	light: <SunIcon className="setting-icon" />,
	dark: <MoonIcon className="setting-icon" />,
	en: <LanguageIcon className="setting-icon" />,
	jp: <LanguageIcon className="setting-icon" />,
};

function SettingButton({
	value, valueList, setValue, label,
}: Props) {
	const { t } = useTranslation('reader');
	return (
		<button
			className="btn flex justify-between whitespace-nowrap"
			type="button"
			onClick={() => setValue((prev) => getNextOption(prev, valueList))}
		>
			{label ? `${t(label)}: ` : ''}
			{' '}
			{t(value)}
			{settingIcons[value]}
		</button>
	);
}

export default SettingButton;
