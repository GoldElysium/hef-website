interface IProps {
	title: string;
	description: string;
}

export default function Hero({ title, description }: IProps) {
	return (
		<div className="bg-skin-background-2 dark:bg-skin-dark-background-2 flex h-52 w-full items-center justify-center px-4 py-2">
			<div className="flex w-full max-w-4xl flex-col justify-between sm:flex-row sm:items-end">
				<div className="flex flex-col">
					<h1 className="text-bold text-2xl text-white">
						{title}
					</h1>
					<p className="text-white text-opacity-80">
						{description}
					</p>
				</div>
			</div>
		</div>
	);
}
