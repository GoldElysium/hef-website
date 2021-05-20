interface IProps {
	title: string,
	description: string,
}

export default function Header({ title, description }: IProps) {
	return (
		<div
			className="w-full px-4 py-2 flex pb-4 justify-center items-center text-center
		  bg-skin-background-2 dark:bg-skin-dark-background-2 text-white"
		>
			<div className="max-w-4xl flex flex-col">
				<h1 className="text-5xl text-bold">{title}</h1>
				<p className="text-white text-opacity-80 text-2xl my-4">{description}</p>
			</div>
		</div>
	);
}
