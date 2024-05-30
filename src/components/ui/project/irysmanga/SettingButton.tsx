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
	Bars2Icon,
	MinusIcon,
} from '@heroicons/react/24/outline';
import useTranslation from '@/lib/i18n/client';
import classNames from 'classnames';
import { ReaderSetting } from './utils/types';
import { getNextOption } from './utils/helper';

interface Props {
	value: ReaderSetting;
	valueList: ReadonlyArray<ReaderSetting>;
	setValue: React.Dispatch<React.SetStateAction<ReaderSetting>>;
	label?: string;
}

type SettingIcons = {
	[key in ReaderSetting]: JSX.Element | null;
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
	en: null,
	jp: null,
};

function SettingButton({
	value, valueList, setValue, label,
}: Props) {
	const { t } = useTranslation('reader');
	return (
		<button
			className={classNames('btn flex whitespace-nowrap flex-1', {
				'justify-between': settingIcons[value] !== null,
				'justify-center': settingIcons[value] === null,
			})}
			type="button"
			onClick={() => setValue((prev) => getNextOption(prev, valueList))}
		>
			<div>
				{label ? `${t(label)}: ` : ''}
				{t(value)}
			</div>
			{settingIcons[value]}
		</button>
	);
}

export default SettingButton;
