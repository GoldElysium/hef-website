import Phaser from 'phaser';

const INFO_TEXT = `Tanabata is a Japanese festival; usually held in July or August. In present-day Japan, people generally celebrate this day by writing wishes on small pieces of paper, and hanging them on bamboo (along with various other decorations). As Gura is reaching her 3 million subscriber milestone in July, near the time of Tanabata, we're using this occasion to collect chumbuds' wishes and congratulatory messages for Gura!

* Please note that the submissions will only become viewable when Gura's sub count reaches 3 Million. Until then enjoy this nice background and BGM, and scroll down in this window for credits and a link to download the BGM.

Credits:
BGM - Guratanabata by Jesterdist. 
Free download [color=#163fc9]https://soundcloud.com/user-97587542/guratanabata[/color]
(Gura you can use this BGM if you want. It's loopable!)

Project artwork:
Layouts, Backgrounds, Assets - Caudy the Corgi
Napping Gura - DuDuL

Programmers:
Edqe_
K4rakara

Coordinator: Sephi

Submissions: Chumbuds everywhere`;

export default class Info extends Phaser.Scene {
	public width!: number;

	public height!: number;

	public bg!: Phaser.GameObjects.Image;

	public closeArea!: Phaser.GameObjects.Rectangle;

	public textArea!: any;

	public ui!: import('./plugins/ui').default;

	public container: any;

	public finished = false;

	init() {
		const { width, height } = this.game.canvas;
		this.width = width;
		this.height = height;
		this.input.setDefaultCursor('auto');
	}

	create() {
		this.closeArea = this.add.rectangle(0, 0, this.width, this.height, 0x0e0e0e, 0.4)
			.setOrigin(0, 0)
			.setInteractive({ cursor: 'pointer' })
			.on('pointerup', () => this.close());

		this.bg = this.add.image(this.width / 2, this.height * 2, 'infoBG')
			.setOrigin(0.5, 1)
			.setScale(0.75)
			.setInteractive({ pixelPerfect: true });

		const text = this.ui.text(0, 0, '', 48, undefined, {
			align: 'left',
		}, true)
			.setDepth(5)
			.on('areadown', (key: string) => {
				switch (key) {
					case 'bgm': {
						window.open('https://soundcloud.com/user-97587542/guratanabata', '_blank', 'noopener noreferrer');
						break;
					}

					default: break;
				}
			});

		// @ts-expect-error
		this.textArea = this.rexUI.add.textArea({
			anchor: {
				centerX: '50%',
				centerY: '63%',
			},
			width: this.bg.displayWidth - 800,
			height: 450,
			text,
			content: INFO_TEXT,
		}).setAlpha(0).layout();

		// @ts-expect-error
		this.container = this.add.rexContainerLite(
			0, 0,
			this.width, this.height,
			[this.bg, this.textArea],
		);

		this.container.tweenChild({
			targets: this.bg,
			ease: 'Sine.easeInOut',
			y: this.height,
			duration: 500,
		}).once('complete', () => {
			this.container.tweenChild({
				targets: this.textArea,
				ease: 'Sine.easeInOut',
				alpha: 1,
				duration: 150,
			}).once('complete', () => {
				this.finished = true;
			});
		});

		this.input.on('wheel', (_: any, __: any, ___: any, dy: number) => {
			if (dy > 0) {
				this.textArea.setT(Math.min(this.textArea.t + 0.15, 1));
			} else if (dy < 0) {
				this.textArea.setT(Math.max(this.textArea.t - 0.15, 0));
			}
		});
	}

	close() {
		if (!this.finished) return;
		this.container.tweenChild({
			targets: this.textArea,
			ease: 'Sine.easeInOut',
			alpha: 0,
			duration: 100,
		}).once('complete', () => {
			this.container.tweenChild({
				targets: this.bg,
				ease: 'Sine.easeInOut',
				y: this.height * 2,
				duration: 400,
			}).once('complete', () => {
				this.finished = false;
				this.input.setDefaultCursor('pointer');
				this.scene.stop();
			});
		});
	}
}