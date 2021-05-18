interface IProps {
	text: string,
}

export default function TextHeader({ text }: IProps) {
	return (
		<h2
			className="text-2xl font-bold border-b-2 text-center sm:text-left mb-6
			text-skin-primary-1 dark:text-skin-dark-primary-1 border-skin-primary-1 border-opacity-30 dark:border-skin-dark-primary-1 dark:border-opacity-40"
		>
			{text}
		</h2>
	);
}
