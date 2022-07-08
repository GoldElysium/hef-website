import Phaser from 'phaser';
import { Submission } from '../../../types/payload-types';

const PAPER_SLIDES = [
	'paperslide1',
	'paperslide2',
	'paperslide3',
];

export default class FullPaper extends Phaser.Scene {
	public width!: number;

	public height!: number;

	public closeArea!: Phaser.GameObjects.Rectangle;

	public bg!: Phaser.GameObjects.Image;

	public message!: Phaser.GameObjects.Text;

	public author!: Phaser.GameObjects.Text;

	public ui!: import('./plugins/ui').default;

	public image?: Phaser.GameObjects.Image;

	public closeIcon!: Phaser.GameObjects.Image;

	init(data: any) {
		this.data.set(data, null);

		const { width, height } = this.game.canvas;
		this.width = width;
		this.height = height;
	}

	create() {
		this.sound.play(PAPER_SLIDES[Math.floor(Math.random() * PAPER_SLIDES.length)], {
			volume: 0.2,
		});

		this.closeArea = this.add.rectangle(0, 0, this.width, this.height, 0x0e0e0e, 0.4)
			.setOrigin(0, 0)
			.setInteractive({ cursor: 'pointer' })
			.once('pointerup', () => this.close());

		this.bg = this.add.image(this.width / 2, this.height / 2, this.data.get('paper'))
			.setOrigin(0.5, 0.65)
			.setScale(5)
			.setInteractive();

		const bgBounds = this.bg.getBounds();
		this.closeIcon = this.add.image(bgBounds.right - 10, 10, 'close')
			.setDepth(1)
			.setOrigin(1, 0)
			.setScale(0.8)
			.setInteractive({ cursor: 'pointer' })
			.once('pointerup', () => this.close());

		const submission = this.data.get('submission') as Submission;
		this.message = this.ui.text(
			bgBounds.left + 100,
			150,
			submission.message as string,
			64,
			submission.type === 'text' ? this.bg.displayWidth - 200 : 550,
			{
				align: 'left',
			},
		).setOrigin(0, 0) as Phaser.GameObjects.Text;

		this.author = this.ui.text(
			bgBounds.left + 100,
			this.height - 120,
			submission.author as string,
			48,
			850,
			{
				align: 'left',
			},
		).setOrigin(0, 1) as Phaser.GameObjects.Text;

		if (submission.type === 'image') {
			const key = `submission-image-${submission.author}`;
			const height = 850;
			const width = 900;

			const start = bgBounds.left + 400;
			const end = bgBounds.right - 400;

			this.image = this.add.image(
				start + ((end - start) / 2),
				this.height / 2 - 20,
				key,
			)
				.setOrigin(0.5, 0.5)
				.setInteractive({ cursor: 'pointer' })
				.on('pointerup', () => window.open(this.registry.get('submissionURLs')[key], '_blank', 'noopener noreferrer'));

			const calculatedWidth = this.image.width * (height / this.image.height);
			const calculatedHeight = this.image.height * (width / this.image.width);

			const args: [number, number] = (calculatedWidth > calculatedHeight
				? [width, calculatedHeight]
				: [calculatedWidth, height]);
			this.image.setDisplaySize(...args);
		}

		this.tweens.add({
			targets: [this.closeArea, this.bg, this.message, this.author, this.image, this.closeIcon],
			alpha: {
				from: 0,
				to: 1,
			},
			ease: 'Sine.easeInOut',
			duration: 200,
		});
	}

	close() {
		this.tweens.add({
			targets: [this.closeArea, this.bg, this.message, this.author, this.image, this.closeIcon],
			alpha: {
				from: 1,
				to: 0,
			},
			ease: 'Sine.easeInOut',
			duration: 200,
		}).once('complete', () => this.scene.stop());
	}
}
