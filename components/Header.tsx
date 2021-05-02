interface IProps {
	title: string,
	description: string,
}

export default function Header({ title, description }: IProps) {
	return (
		<div className="bg-red-500 w-full text-white px-4 py-2 flex pb-4 justify-center items-center text-center">
			<div className="max-w-4xl flex flex-col">
				<h1 className="text-5xl text-bold">{title}</h1>
				<p className="text-red-100 text-2xl my-4">{description}</p>
			</div>
		</div>
	);
}