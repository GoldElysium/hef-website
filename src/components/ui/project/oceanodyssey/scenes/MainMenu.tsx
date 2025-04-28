import { useNavigate } from 'react-router-dom';
import { useRouter } from 'next/navigation';
import type { Project } from '@/types/payload-types';

interface IProps {
	project: Omit<Project, 'flags' | 'devprops'> & {
		flags: string[];
		devprops: {
			[key: string]: string;
		};
	};
}

interface MenuButton {
	label: string;
	onClick: () => void;
	textColor?: number | string;
	disabled?: boolean;
}

export default function MainMenu({ project }: IProps) {
	const navigate = useNavigate();
	const nextRouter = useRouter();

	const centerButtons: MenuButton[] = [
		{
			label: 'Start',
			onClick: () => {
				navigate('/game');
			},
			disabled: true,
		},
		{
			label: 'Settings',
			onClick: () => {
				navigate('/settings');
			},
			disabled: true,
		},
		{
			label: 'Logbook',
			onClick: () => {
				navigate('/logbook');
			},
		},
		{
			label: 'Credits',
			onClick: () => {},
			disabled: true,
		},
		{
			label: 'Exit',
			textColor: 0x466494,
			onClick: () => nextRouter.back(),
		},
	];

	return (
		<div className="font-[Arial] max-w-4xl p-24 2xl:p-32 min-h-screen min-w-screen bg-[#414141]">
			<div className="flex flex-col gap-4 w-4/12">
				<h2 className="text-4xl 2xl:text-6xl text-white">
					Kronii&apos;s
					<br />
					Ocean Odyssey
				</h2>
				<div className="flex flex-col gap-4 2xl:gap-8 mt-8 2xl:mt-32">
					{centerButtons.map((button) => (
						<button
							type="button"
							key={button.label}
							onClick={button.onClick}
							disabled={button.disabled}
							className={`px-6 py-4 ${button.disabled ? 'cursor-not-allowed bg-[#1A4368]' : 'cursor-pointer bg-[#2E75B5]'} text-2xl`}
						>
							{button.label}
						</button>
					))}
				</div>
			</div>

			<div className="absolute flex flex-col right-32 bottom-16 gap-4 w-2/12">
				<button
					type="button"
					disabled
					className="px-6 py-2 cursor-not-allowed bg-[#1A4368] text-xl"
				>
					How to play
				</button>
				<button
					type="button"
					disabled
					className="px-6 py-2 cursor-not-allowed bg-[#1A4368] text-xl"
				>
					Cheats
				</button>
			</div>

			<span className="absolute bottom-8 left-16 text-white">
				Version:
				{' '}
				{project.devprops.version}
			</span>
		</div>
	);
}
