import { useNavigate } from 'react-router-dom';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/pixi/Button';
import { useApplication } from '@pixi/react';
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

	const { app } = useApplication();

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
		<pixiContainer>
			<pixiText
				text={'Kronii\'s\nOcean Odyssey'}
				style={{
					fontFamily: 'Arial',
					fontSize: 96,
					fill: 0xffffff,
				}}
				anchor={0.5}
				x={app.renderer.width * 0.2}
				y={240}
			/>
			{centerButtons.map((button, index) => (
				<Button
					key={button.label}
					label={button.label}
					x={app.renderer.width * 0.15}
					y={index * 120 + 480}
					width={300}
					height={96}
					color={button.disabled ? 0x1A4368 : 0x2E75B5}
					textStyle={{
						fill: button.disabled ? 0xAAAAAA : 'white',
						fontSize: 40,
					}}
					onClick={button.onClick}
					disabled={button.disabled}
				/>
			))}

			<Button
				x={app.renderer.width * 0.7}
				y={app.renderer.height - 368}
				width={300}
				height={96}
				label="How to play"
				color={0x1A4368}
				textStyle={{ fill: 0xAAAAAA, fontSize: 40 }}
				disabled
				onClick={() => {}}
			/>

			<Button
				x={app.renderer.width * 0.7}
				y={app.renderer.height - 240}
				width={300}
				height={96}
				label="Cheats"
				color={0x1A4368}
				textStyle={{ fill: 0xAAAAAA, fontSize: 40 }}
				disabled
				onClick={() => {}}
			/>

			<pixiText
				text={`Version: ${project.devprops.version}`}
				style={{
					fill: 'white',
				}}
				x={64}
				y={app.renderer.height - 64}
			/>
		</pixiContainer>
	);
}
