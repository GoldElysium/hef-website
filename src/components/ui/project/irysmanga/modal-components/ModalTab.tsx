interface Props {
	label: string;
	selected: string;
	setSelected: (val: string) => void;
}
function ModalTab({ label, selected, setSelected }: Props) {
	return (
		<input
			type="radio"
			name="my_tabs"
			role="tab"
			className="tab"
			aria-label={label}
			checked={selected === label}
			value={label}
			onChange={() => setSelected(label)}
		/>
	);
}

export default ModalTab;
