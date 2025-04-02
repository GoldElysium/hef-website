import { useNavigate } from 'react-router-dom';
import InteractiveText from '../../util/InteractiveText';

interface CollectiblesProps {
	width: number;
}

function Collectibles({
	width,
}: CollectiblesProps) {
	const navigate = useNavigate();

	return (
		<pixiContainer>
			<pixiText
				text="Collectibles"
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
				label="back"
				x={0}
				y={0}
				textColor={0x466494}
				onClick={() => navigate(-1)}
			/>
		</pixiContainer>
	);
}

export default Collectibles;
