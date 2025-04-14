import Button from '@/components/ui/pixi/Button';
import type { TextStyle } from 'pixi.js';

interface InteractiveTextProps {
	label: string;
	x: number;
	y: number;
	textColor: number;
	onClick: () => void;
}

function InteractiveText({
	label,
	x,
	y,
	textColor,
	onClick,
}: InteractiveTextProps) {
	return (
		<Button
			label={label}
			textStyle={{
				fontFamily: 'Arial',
				fontSize: 40,
				fontWeight: 'bolder',
				fill: textColor,
				stroke: 'white',
			} as TextStyle}
			x={x}
			y={y}
			width={200}
			height={60}
			color={undefined}
			onClick={onClick}
		/>
	);
}

export default InteractiveText;
