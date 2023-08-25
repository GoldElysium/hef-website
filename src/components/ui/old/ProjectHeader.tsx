interface IProps {
	title: string,
	description: string,
}

export default function ProjectHeader({ title, description }: IProps) {
	return (
		<div
			className="bg-skin-background-2 dark:bg-skin-dark-background-2 flex w-full items-center justify-center px-4 py-2
		  pb-4 text-center text-white"
		>
			<div className="flex max-w-4xl flex-col">
				<h1 className="text-bold text-5xl">{title}</h1>
				<p className="my-4 text-2xl text-white text-opacity-80">{description}</p>
			</div>
		</div>
	);
}
