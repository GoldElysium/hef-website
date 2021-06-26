import Phaser from 'phaser';

class Splash extends Phaser.Scene {
	public width!: number;

	public height!: number;

	public googleFonts!: import('./plugins/gfonts').default;

	public ui!: import('./plugins/ui').default;

	public subCount!: number;

	public key?: string;

	public bg?: Phaser.GameObjects.Image;

	public bamboo?: Phaser.GameObjects.Image;

	public gura?: Phaser.GameObjects.Video;

	public container: any;

	init({ subCount }: { subCount: number }) {
		const { width, height } = this.game.canvas;
		this.width = width;
		this.height = height;
		this.subCount = subCount;

		this.cameras.main.setBackgroundColor('#010007');
	}

	preload() {
		this.load.image('bg', '/assets/gura3mil/bg.webp');
		this.load.video('gura', '/assets/gura3mil/gura.webm', undefined, true, true);

		// @ts-expect-error Missing type
		this.load.rexAwait(async (resolve) => {
			await this.googleFonts.configure();

			const i = this.ui.clamp(Math.floor((this.subCount - 2900000) / 20000) - 1, 0, 4);
			this.key = `bamboo${i}`;
			this.load.image(this.key, [
				'/assets/gura3mil/bamboo1.webp',
				'/assets/gura3mil/bamboo2.webp',
				'/assets/gura3mil/bamboo3.webp',
				'/assets/gura3mil/bamboo4.webp',
			][i]);
			resolve();
		});
	}

	async create() {
		this.bg = this.add.image(this.width / 2, this.height / 2, 'bg')
			.setOrigin(0.5, 0.5)
			.setDisplaySize(this.width, this.height)
			.setScale(1.2);
		this.bamboo = this.add.image(this.width / 2, this.height - 5, this.key as string)
			.setOrigin(0.5, 1)
			.setDepth(1)
			.setScale(0.82);
		this.gura = this.add.video(this.width / 1.84, this.height + 2, 'gura')
			.setOrigin(1, 1)
			.setScale(0.3)
			.setDepth(1)
			.setTint(0x446b18, 0xffffff, 0x446b18, 0xf7f3a5)
			.play(true);

		// @ts-expect-error
		this.container = this.add.rexContainerLite(0, 0, this.width, this.height)
			.addMultiple([this.bamboo, this.gura])
			.setAlpha(0);

		this.cameras.main.setZoom(0.8);
		this.tweens.createTimeline()
			.add({
				targets: this.cameras.main,
				ease: 'Sine.easeInOut',
				duration: 1000,
				zoom: 1,
			})
			.add({
				targets: this.bg,
				ease: 'Sine.easeInOut',
				duration: 1000,
				scale: 1,
				offset: '-=1000',
			})
			.add({
				targets: this.container,
				ease: 'Sine.easeInOut',
				duration: 500,
				alpha: 1,
				offset: '-=1000',
			})
			.play();

		this.input.once('pointerup', async () => {
			// if (this.subCount < 3000000) return;
			const timeline = this.tweens.createTimeline()
				.add({
					targets: this.cameras.main,
					ease: 'Sine.easeInOut',
					duration: 2000,
					zoom: 1.8,
				})
				.add({
					targets: this.container,
					ease: 'Sine.easeInOut',
					duration: 2000,
					y: '-=250',
					offset: '-=2000',
				})
				.add({
					targets: this.container,
					ease: 'Sine.easeInOut',
					duration: 1000,
					alpha: 0,
					offset: '-=1000',
				});

			timeline.once('start', async () => {
				await this.ui.sleep();
				this.scene.bringToTop('main');
				this.scene.launch('main', { subCount: this.subCount });
				this.tweens.add({
					targets: this.gura,
					ease: 'Sine.easeInOut',
					alpha: 0,
					duration: 1000,
				});
				await this.ui.sleep();
				this.scene.stop('splash');
			}).play();
		});
	}
}

export default Splash;
