import { motion, useDragControls } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

interface IProps {
	src: string;
	className: string;
	width?: string;
	containerRef: React.RefObject<HTMLDivElement>;
}

const initialAnimation = {
	animate: { y: [0, -10, 0] },
	transition: { duration: 3, repeat: Infinity },
};

const fallingAnimation = {
	animate: { y: 3000 },
	transition: { duration: 2, ease: 'easeInOut' },
};

const dragStartAnimation = {
	animate: { x: [0, 5, -5, 5, -10, 10, 0] },
	transition: { duration: 0.3, ease: 'easeInOut' },
};

export default function FloatingDecoArtDraggable({
	src, className, width, containerRef,
}: IProps) {
	const controls = useDragControls();
	const [state, setState] = useState('initial');
	const [dragStarted, setDragStarted] = useState(false);
	const flatPlayed = useRef(false);
	const [animation, setAnimation] = useState<{ animate: {}; transition: {} }>(initialAnimation);

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
	const targetRef = useRef<HTMLImageElement>(null);

	useEffect(() => {
		audioRefSplat.current.volume = 0.5;
		audioRefDrag.current.load();
		audioRefFall.current.load();
		audioRefFlat.current.load();
	}, []);
	const handleIntersection = (entries: IntersectionObserverEntry[]) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting && state === 'flat' && !flatPlayed.current) {
				audioRefFlat.current.play();
				flatPlayed.current = true;
			}
		});
	};
	useEffect(() => {
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
		audioRefDrag.current?.pause();
		audioRefFall.current?.play();
	};

	const handleAnimationComplete = (def: {}) => {
		if (state === 'falling' && def === fallingAnimation.animate) {
			setState('flat');
			audioRefSplat.current?.play();
		}
	};
	useEffect(() => {
		if (state === 'falling' || state === 'flat') {
			setAnimation(fallingAnimation);
			return;
		}
		if (dragStarted) {
			setAnimation(dragStartAnimation);
		}
	}, [state, dragStarted]);

	const [constraints, setConstraints] = useState<{
		left: number;
		right: number;
		top?: number;
		bottom?: number;
	}>();
	useEffect(() => {
		const handleResize = () => {
			if (containerRef.current && targetRef.current) {
				const targetRect = targetRef.current.getBoundingClientRect();
				const containerRect = containerRef.current.getBoundingClientRect();
				setConstraints({
					left: containerRect.left - targetRect.left - 75,
					right: Math.abs(targetRect.right - containerRect.right),
					top: containerRect.top - targetRect.top,
					bottom: Math.abs(targetRect.bottom - containerRect.bottom),
				});
			}
		};
		handleResize();
		window.addEventListener('resize', handleResize);
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	return (
		<motion.img
			className={className}
			drag={state !== 'flat'}
			dragControls={controls}
			dragElastic={{ top: 0.5, bottom: 0.5 }}
			animate={animation.animate}
			transition={animation.transition}
			dragConstraints={constraints}
			onPointerDown={(e) => {
				handleDragStart(e);
			}}
			onPointerUp={handleDragEnd}
			onDragEnd={handleDragEnd}
			onAnimationComplete={(def) => {
				handleAnimationComplete(def);
			}}
			ref={targetRef}
			src={data[state].img}
			alt="bg-art"
			width={width}
		/>
	);
}
