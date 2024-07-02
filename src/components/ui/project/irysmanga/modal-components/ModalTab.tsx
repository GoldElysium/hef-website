import styles from '../styles/Modal.module.css';

interface IProps {
	label: string;
	selected: string;
	setSelected: (val: string) => void;
}

function ModalTab({ label, selected, setSelected }: IProps) {
	return (
		<input
			type="radio"
			name="my_tabs"
			role="tab"
			className={styles.modalTab}
			aria-label={label}
			checked={selected === label}
			value={label}
			onChange={() => setSelected(label)}
		/>
	);
}

export default ModalTab;
