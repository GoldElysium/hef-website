import { motion, useDragControls } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

interface IProps {
	src: string;
	className: string;
	width?: string;
}

export default function FloatingDecoArt({ src, className, width }: IProps) {
	const controls = useDragControls();
	const [state, setState] = useState('initial');
	const [dragStarted, setDragStarted] = useState(false);
	const [dragEnded, setDragEnded] = useState(false);
	const flatPlayed = useRef(false);

	const data: { [key: string]: { img: string; sfx: string } } = {
		initial: { img: src, sfx: '/assets/irysmanga/audio/dragging.mp3' },
		falling: {
			img: '/assets/irysmanga/chibi/fallingrys.png',
			sfx: '/assets/irysmanga/audio/falling.mp3',
		},
		flat: {
			img: '/assets/irysmanga/chibi/flatrys.png',
			sfx: '/assets/irysmanga/audio/flatting.mp3',
		},
	};

	const audioRefDrag = useRef(new Audio(data.initial.sfx));
	const audioRefFall = useRef(new Audio(data.falling.sfx));
	const audioRefFlat = useRef(new Audio(data.flat.sfx));
	const audioRefSplat = useRef(new Audio('/assets/irysmanga/audio/splat.mp3'));
	const targetRef = useRef(null);

	useEffect(() => {
		audioRefSplat.current.volume = 0.5;
		audioRefDrag.current.load();
		audioRefFall.current.load();
		audioRefFlat.current.load();
	}, []);

	useEffect(() => {
		const handleIntersection = (entries: IntersectionObserverEntry[]) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting && state === 'flat' && !flatPlayed.current) {
					audioRefFlat.current.play();
					flatPlayed.current = true;
				}
			});
		};

		const observer = new IntersectionObserver(handleIntersection, {
			root: null,
			rootMargin: '0px',
			threshold: 0.1,
		});
		const currentTarget = targetRef.current;

		if (currentTarget) {
			observer.observe(currentTarget);
		}

		return () => {
			if (currentTarget) {
				observer.unobserve(currentTarget);
			}
		};
	}, [state, flatPlayed]);

	const handleDragStart = (e: React.PointerEvent<HTMLDivElement>) => {
		if (state === 'flat') {
			return;
		}
		controls.start(e);
		setState('initial');
		setDragStarted(true);
		audioRefDrag.current?.play();
	};

	const handleDragEnd = () => {
		setState('falling');
		setDragStarted(false);
		audioRefFall.current?.play();
	};

	const handleAnimationComplete = () => {
		if (state === 'initial') {
			setDragEnded(true);
			return;
		}
		if (dragEnded) {
			setDragEnded(false);
			return;
		}
		setState('flat');
		audioRefSplat.current?.play();
	};
	const getAnimation = () => {
		if (state === 'falling' || state === 'flat') {
			return { y: 3000 };
		}
		if (dragStarted) {
			return {
				x: [0, 5, -5, 5, -10, 10],
			};
		}
		return {};
	};
	const getTransition = () => {
		if (state === 'falling' || state === 'flat') {
			return { duration: 2, ease: 'easeInOut' };
		}
		if (dragStarted) {
			return {
				transition: {
					duration: 1,
					ease: 'easeInOut',
					repeat: Infinity,
				},
			};
		}
		return {};
	};

	return (
		<motion.div
			className={className}
			drag={state !== 'flat'}
			dragControls={controls}
			dragElastic={0.5}
			animate={getAnimation()}
			transition={getTransition()}
			onPointerDown={(e) => {
				handleDragStart(e);
			}}
			onDragEnd={handleDragEnd}
			onAnimationComplete={handleAnimationComplete}
			ref={targetRef}
		>
			<motion.img src={data[state].img} alt="bg-art" width={width} draggable={false} />
		</motion.div>
	);
}
