import React from 'react';

interface IState {
	currentImage: string | null,
	targetImage: string | null,
	timeout: number,
}

export default class BlurBackground extends React.Component<{}, IState> {
	constructor() {
		super({});
		this.state = {
			currentImage: null,
			targetImage: null,
			timeout: 0,
		};
	}

	setBackgroundImage(to: string) {
		const { timeout } = this.state;
		clearTimeout(timeout);
		this.setState((state) => ({
			...state,
			targetImage: to,
			timeout: (setTimeout(() => {
				this.setState((state2) => ({
					...state2,
					currentImage: state2.targetImage,
					targetImage: null,
				}));
			}, 500) as unknown) as number,
		}));
	}

	render() {
		const { currentImage, targetImage } = this.state;
		return (
			<div id="blur-background" className="absolute overflow-hidden w-screen h-screen fixed -z-1 bg-black">
				<img
					className="absolute w-full h-full object-cover filter blur-xl transform scale-125"
					src={currentImage!}
					alt=""
				/>
				{(targetImage != null)
					? <img className="absolute w-full h-full object-cover filter blur-xl transform scale-125 blur-background-target" src={targetImage} alt="" />
					: <></>}
			</div>
		);
	}
}
