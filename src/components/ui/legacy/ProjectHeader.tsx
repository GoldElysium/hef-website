import 'server-only';
import { Project } from '@/types/payload-types';

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
			className="bg-skin-background-2 dark:bg-skin-dark-background-2 flex w-full items-center justify-center bg-cover bg-center
		  px-4 py-2 pb-4 text-center text-white"
			style={background ? {
				backgroundImage: background ? `url(${background.value})` : undefined,
				height: '16rem',
				color: foregroundColor ? `${foregroundColor.value}!important` : undefined,
			} : {}}
		>
			<div className="flex max-w-4xl flex-col">
				<h1 className="text-bold text-5xl">{title}</h1>
				<p className="my-4 text-2xl text-opacity-80">{description}</p>
			</div>
		</div>
	);
}
