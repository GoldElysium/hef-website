import Link from 'next/link';

interface IProps {
	img?: string,
	title: string,
	description: string,
	button: string,
	url: string,
	internal?: boolean,
}

export default function Card({ img, title, description, button, url, internal }: IProps) {
	return (
		<div className="mt-4 sm:w-1/3">
			<div
				className="bg-white p-8 h-full border-b-4 border-red-500 rounded-lg flex flex-col justify-between items-center sm:mx-2 sm:p-3 md:p-8">
				{/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
				<div className="flex flex-col items-center">
					{img && <img className="h-32 rounded-full" src={img} alt=""/>}
					<h2 className="font-bold text-xl mt-3 text-center">{title}</h2>
					<p className="text-center mt-2">{description}</p>
				</div>
				{internal ?
					<Link href={url}>
						<div
							className="rounded-3xl bg-red-500 text-white font-bold w-20 h-10 flex items-center justify-center mt-4 content-end hover:text-red-200 cursor-pointer">
							<a>{button}</a>
						</div>
					</Link> :
					<a href={url}>
						<div
							className="rounded-3xl bg-red-500 text-white font-bold w-20 h-10 flex items-center justify-center mt-4 content-end hover:text-red-200 cursor-pointer">
							{button}
						</div>
					</a>}
			</div>
		</div>
	);
}
