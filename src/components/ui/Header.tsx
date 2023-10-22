import { Project } from '@/types/payload-types';

interface IProps {
	title: string;
	description: string;
	devprops?: Project['devprops'];
}

export default function ProjectHeader({ title, description, devprops }: IProps) {
	const background = devprops?.find((prop) => prop.key === 'headerBackgroundImage');
	const foregroundColor = devprops?.find((prop) => prop.key === 'headerForegroundColor');

	return (
		<div
			className="text-skin-header-foreground dark:text-skin-header-foreground-dark"
		>
			<div
				className="grid h-72 w-full place-items-center bg-skin-header px-4 py-2 dark:bg-skin-header-dark md:pt-12"
				style={background ? {
					backgroundImage: background ? `url(${background.value})` : undefined,
					height: '16rem',
					color: foregroundColor ? `${foregroundColor.value}!important` : undefined,
				} : {}}
			>
				<div className="grid w-full max-w-4xl place-items-center text-center">
					<div className="flex flex-col gap-4">
						<h1 className="text-3xl font-extrabold md:text-6xl">
							{title}
						</h1>
						<p className="text-lg font-semibold md:text-3xl">
							{description}
						</p>
					</div>
				</div>
			</div>

			{!background && (
				<svg
					className="w-full bg-skin-background text-skin-header dark:bg-skin-background-dark dark:text-skin-header-dark"
					viewBox="0 0 1920 116"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M0 25.7529L32 40.7568C64 55.9846 128 85.9923 192 100.996C256 116 320 116 384 103.236C448 90.2471 512 64.4942 576 64.4942C640 64.4942 704 90.2471 768 92.4865C832 94.5019 896 73.0039 960 60.2394C1024 47.251 1088 42.9961 1152 47.251C1216 51.5058 1280 64.4942 1344 60.2394C1408 55.9846 1472 34.4865 1536 36.5019C1600 38.7413 1664 64.4942 1728 81.7374C1792 98.9807 1856 107.49 1888 111.745L1920 116V0H1888C1856 0 1792 0 1728 0C1664 0 1600 0 1536 0C1472 0 1408 0 1344 0C1280 0 1216 0 1152 0C1088 0 1024 0 960 0C896 0 832 0 768 0C704 0 640 0 576 0C512 0 448 0 384 0C320 0 256 0 192 0C128 0 64 0 32 0H0V25.7529Z"
						fill="currentColor"
					/>
				</svg>
			)}
		</div>
	);
}
