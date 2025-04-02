import { useNavigate } from 'react-router-dom';
import InteractiveText from '../../util/InteractiveText';
import { notYetImplemented } from '../../util/utils';

interface MainMenuProps {
	width: number;
}

function MainMenu({
	width,
}: MainMenuProps) {
	const navigate = useNavigate();

	const centerButtons = [
		{
			label: 'Start',
			textColor: 0x0011ff,
			onClick: () => navigate('/game'),
		},
		{
			label: 'Settings',
			textColor: 0x466494,
			onClick: () => navigate('/settings'),
		},
		{
			label: 'Collectibles',
			textColor: 0x466494,
			onClick: () => navigate('/collectibles'),
		},
		{
			label: 'Exit',
			textColor: 0x466494,
			onClick: () => {
				// TODO exit the game instead of showing this alert
				alert('Exiting the game... (function not added yet)');
			},
		},
	];

	const bottomButtons = [
		{
			label: 'Game info',
			offset: 0.1,
			onClick: notYetImplemented,
		},
		{
			label: 'How to play',
			offset: 0.7,
			onClick: notYetImplemented,
		},
	];

	return (
		<pixiContainer>
			<pixiText
				text={'Kronii\'s Ocean Odyssey'}
				style={{
					fontFamily: 'Arial',
					fontSize: 50,
					align: 'center',
					fill: 0xffffff,
				}}
				anchor={0.5}
				x={width / 2}
				y={150}
			/>
			{centerButtons.map((button, index) => (
				<InteractiveText
					key={button.label}
					label={button.label}
					x={width / 2 - 100}
					y={index * 100 + 240}
					textColor={button.textColor}
					onClick={button.onClick}
				/>
			))}
			{bottomButtons.map((button) => (
				<InteractiveText
					key={button.label}
					label={button.label}
					x={width * button.offset}
					y={600}
					textColor={0x466494}
					onClick={button.onClick}
				/>
			))}
		</pixiContainer>
	);
}

export default MainMenu;
