import 'server-only';
import { Project } from 'types/payload-types';

interface IProps {
	title: string;
	description: string;
	devprops: Project['devprops'];
}

export default function ProjectHeader({ title, description, devprops }: IProps) {
	const background = devprops?.find((prop) => prop.key === 'headerBackgroundImage');
	const foregroundColor = devprops?.find((prop) => prop.key === 'headerForegroundColor');

	return (
		<div
			className="w-full px-4 py-2 flex pb-4 justify-center items-center text-center
		  bg-skin-background-2 dark:bg-skin-dark-background-2 text-white bg-center bg-cover"
			style={background ? {
				backgroundImage: background ? `url(${background.value})` : undefined,
				height: '16rem',
				color: foregroundColor ? `${foregroundColor.value}!important` : undefined,
			} : {}}
		>
			<div className="max-w-4xl flex flex-col">
				<h1 className="text-5xl text-bold">{title}</h1>
				<p className="text-opacity-80 text-2xl my-4">{description}</p>
			</div>
		</div>
	);
}
