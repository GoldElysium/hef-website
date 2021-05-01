import Link from 'next/link';

interface IProps {
	img?: string,
	title: string,
	description: string,
	button: string,
	url: string,
}

export default function DashboardCard({ img, title, description, button, url }: IProps) {
	return (
		<div className="mt-4 sm:w-1/3">
			<div
				className="bg-white p-8 h-full border-b-4 border-red-500 rounded-lg flex flex-col items-center sm:mx-2 sm:p-3 md:p-8">
				{img && <img className="h-32 rounded-full" src={img} alt="Server logo"/>}
				<h2 className="font-bold text-xl mt-3">{title}</h2>
				<p className="text-center mt-2">{description}</p>
				<Link href={url}>
					<div className="rounded-3xl bg-red-500 text-white font-bold w-20 h-10 flex items-center justify-center mt-4 content-end hover:text-red-200 cursor-pointer">
						<a>{button}</a>
					</div>
				</Link>
			</div>
		</div>
	);
}