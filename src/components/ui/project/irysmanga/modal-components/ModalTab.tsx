import useTranslation from '@/lib/i18n/client';

interface IProps {
	label: string;
	selected: string;
	setSelected: (val: string) => void;
}

export default function ModalTab({ label, selected, setSelected }: IProps) {
	const { t } = useTranslation('reader');
	return (
		<input
			type="radio"
			name="my_tabs"
			role="tab"
			className="tab"
			aria-label={t(label)}
			checked={selected === label}
			value={label}
			onChange={() => setSelected(label)}
		/>
	);
}
