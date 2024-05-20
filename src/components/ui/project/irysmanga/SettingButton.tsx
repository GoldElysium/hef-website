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
	hidden: <StopIcon className="setting-icon" />,
	shown: <WindowIcon className="setting-icon" />,
	irysLight: <SunIcon className="setting-icon" />,
	irysDark: <MoonIcon className="setting-icon" />,
	en: <LanguageIcon className="setting-icon" />,
	jp: <LanguageIcon className="setting-icon" />,
};

function SettingButton({
	value, valueList, setValue, label,
}: Props) {
	const { t } = useTranslation('reader');
	return (
		<button
			className="btn btn-secondary flex justify-between whitespace-nowrap hover:btn-primary"
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
