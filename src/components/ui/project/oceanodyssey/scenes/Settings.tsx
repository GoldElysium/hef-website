import { useNavigate } from 'react-router-dom';
import InteractiveText from '../../util/InteractiveText';

interface SettingsProps {
	width: number;
}

function Settings({
	width,
}: SettingsProps) {
	const navigate = useNavigate();

	return (
		<pixiContainer>
			<pixiText
				text="Settings"
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
			<InteractiveText
				label="Fish Data"
				x={width / 2 - 100}
				y={340}
				textColor={0x466494}
				onClick={() => navigate('/fish-data')}
			/>
			<InteractiveText
				label="back"
				x={0}
				y={0}
				textColor={0x466494}
				onClick={() => navigate(-1)}
			/>
		</pixiContainer>
	);
}

export default Settings;
