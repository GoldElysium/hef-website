'use client';

import React from 'react';

interface IState {
	currentImage: string | null;
	targetImage: string | null;
	timeout: number;
}

export default class BlurBackground extends React.Component<{}, IState> {
	constructor(_: any) {
		super(_);
		this.state = {
			currentImage: null,
			targetImage: null,
			timeout: 0,
		};
	}

	// eslint-disable-next-line react/no-unused-class-component-methods
	setBackgroundImage(to: string) {
		const { timeout } = this.state;
		clearTimeout(timeout);
		this.setState((state) => ({
			...state,
			targetImage: to,
			timeout: (setTimeout(() => {
				this.setState((state2) => ({
					...state2,
					currentImage: to,
					targetImage: null,
				}));
			}, 500) as unknown) as number,
		}));
	}

	render() {
		const { currentImage, targetImage } = this.state;
		return (
			<div id="blur-background" className="fixed -z-1 h-screen w-screen overflow-hidden bg-black">
				<img
					className="absolute h-full w-full scale-125 object-cover blur-xl"
					src={currentImage!}
					alt=""
				/>
				{(targetImage !== null)
					&& (<img className="blur-background-target absolute h-full w-full scale-125 object-cover blur-xl" src={targetImage} alt="" />)}
			</div>
		);
	}
}
