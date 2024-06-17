import { motion } from 'framer-motion';

interface IProps {
	src: string;
	className: string;
	width?: string;
}

export default function FloatingDecoArt({ src, className, width }: IProps) {
	return (
		<motion.div
			className={className}
			animate={{ y: [0, -10, 0] }}
			transition={{ duration: 3, repeat: Infinity }}
		>
			<img src={src} alt="bg-art" width={width} />
		</motion.div>
	);
}
