import Phaser from 'phaser';
import { ISubmission } from '../../../models/Submission';

const BASE_WIDTH = 2280;
const BASE_HEIGHT = 1620;
const PAPERS = ['blue', 'purple', 'orange', 'white', 'red'];
const PAPER_POS_DESKTOP = [
	[545, 320],
	[975, 320],
	[1435, 212],
	[1955, 280],
	[2345, 280],
];

const PAPER_POS_NONDESKTOP = [
	[410, 320],
	[905, 320],
	[1435, 212],
	[2025, 280],
	[2478, 280],
];

class Main extends Phaser.Scene {
	public width!: number;

	public height!: number;

	public pages?: never[];

	public sizer: any;

	public rexUI: any;

	public panel: any;

	public ui: any;

	public counter: any;

	public back?: Phaser.GameObjects.Image;

	public tempData: any;

	init(data: any) {
		const { width, height } = this.game.canvas;

		this.width = width;
		this.height = height;
		this.pages = [];
		this.tempData = data;

		this.scene.moveAbove('splash');
	}

	preload() {
		this.load.image('zoomed1', '/assets/gura3mil/zoomedin1.webp');

		this.load.image('blue', '/assets/gura3mil/papers/blue.webp');
		this.load.image('orange', '/assets/gura3mil/papers/orange.webp');
		this.load.image('purple', '/assets/gura3mil/papers/purple.webp');
		this.load.image('red', '/assets/gura3mil/papers/red.webp');
		this.load.image('white', '/assets/gura3mil/papers/white.webp');
	}

	create() {
		const submissions = this.ui.convertTo2D(((this.registry.values?.data?.submissions ?? []) as ISubmission[]).map((s) => `${s.message}\n\n${s.author}`), 5);

		this.sizer = this.rexUI.add.sizer({
			orientation: 'y',
			space: {
				top: -(this.height / 2),
				bottom: this.height / 2,
				left: -(this.width / 2),
			},
		}).add(this.generatePage(submissions[0]).container, {
			align: 'left',
		});

		submissions.slice(1).forEach((sr: string[]) => this.sizer.add(this.generatePage(sr).container, {
			align: 'left',
		}));

		this.panel = this.rexUI.add.scrollablePanel({
			x: 0,
			y: 0,
			width: this.width,
			height: this.height,
			anchor: {
				left: '0%',
				top: '0%',
			},
			panel: {
				child: this.sizer,
				mask: false,
			},
			scroller: {
				slidingDeceleration: 7500,
			},
			clamplChildOY: true,
		})
			.layout()
			.setAlpha(0);

		this.back = this.add.image(5, 0, 'back')
			.setOrigin(0, 0)
			.setDepth(5)
			.setScale(0.75)
			.setInteractive({ pixelPerfect: true, cursor: 'pointer' })
			.once('pointerup', () => {
				this.tweens.add({
					targets: [this.panel, this.counter, this.back],
					alpha: {
						from: 1,
						to: 0,
					},
					ease: 'Sine.easeInOut',
					duration: 500,
				}).once('complete', () => this.scene.start('splash', this.tempData));
			});

		this.tweens.add({
			targets: [this.panel, this.counter, this.back],
			alpha: {
				from: 0,
				to: 1,
			},
			ease: 'Sine.easeInOut',
			duration: 1000,
		}).once('complete', () => {
			this.cameras.main.setBackgroundColor('#010007');
			this.input.on('wheel', (_: any, __: any, ___: any, dy: number) => {
				const items = this.panel.getElement('panel').getElement('items').length;
				if (dy > 0) {
					this.panel.setT(Math.min(this.panel.t + (0.1 / items) * 1.1, 1));
				} else if (dy < 0) {
					this.panel.setT(Math.max(this.panel.t - (0.1 / items) * 1.1, 0));
				}
			});
		});
	}

	setValues() {
		const { t } = this.panel;

		const total = this.sizer.children.length;
		const each = 1 / total;

		this.counter.setText(`[size=60]${this.ui.getPage(t, each, total)}[/size] [color=#afafaf]/ ${total}[/color]`);
	}

	generatePage(messages: string[] = []) {
		let bg: any;
		let paperPos: number[][];

		if (this.game.device.os.desktop) {
			paperPos = PAPER_POS_DESKTOP;
			bg = this.rexUI.add.sizer({
				orientation: 0,
				height: this.height,
				width: this.width,
				x: this.width / 2,
				y: this.height / 2,
				anchor: {
					x: '50%',
					y: '50%',
				},
			});

			Array(3).fill(0).forEach((_, i) => {
				bg.add(
					this.add.image(0, 0, 'zoomed1')
						.setOrigin(0, 0)
						.setDisplaySize(2150, this.height),
					{
						align: ['left', 'center', 'right'][i],
					},
				);
			});

			bg.layout();
		} else {
			paperPos = PAPER_POS_NONDESKTOP;
			bg = this.add.image(0, 0, 'zoomed1')
				.setOrigin(0, 0)
				.setDisplaySize(1920, 1080);
		}

		// @ts-expect-error
		const placed = this.add.rexContainerLite(0, 0, this.width, this.height);
		const papers = this.ui.shuffle(PAPERS);
		paperPos.forEach((c, i) => {
			if (messages[i] === undefined || messages[i] === null) return;

			const x = c[0] * ((this.width / BASE_WIDTH) * 0.7895);
			const y = c[1] * ((this.height / BASE_HEIGHT) * 0.9);

			const image = this.add.image(x, y, papers[i])
				.setScale(0.65)
				.setOrigin(0.5, 0);
			const text = this.ui.text(x, y + 250, messages[i], 32, 170).setOrigin(0.5, 0.5);
			// @ts-expect-error
			const cont = this.add.rexContainerLite(x, y, image.width, image.height).setOrigin(0.5, 0);
			cont.addMultiple([image, text]);

			const timeline = this.tweens.createTimeline({
				loop: -1,
				loopDelay: Phaser.Math.Between(20, 100),
				delay: Phaser.Math.Between(50, 100),
			}).add({
				rotation: Phaser.Math.FloatBetween(0.15, 0.25),
				targets: cont,
				ease: 'Sine.easeInOut',
				duration: 1000,
			}).add({
				rotation: Phaser.Math.FloatBetween(0.05, 0.1),
				targets: cont,
				ease: 'Sine.easeInOut',
				duration: 800,
			}).add({
				rotation: Phaser.Math.FloatBetween(0.15, 0.2),
				targets: cont,
				ease: 'Sine.easeInOut',
				duration: 1000,
			})
				.add({
					rotation: Phaser.Math.FloatBetween(0.05, 0.1) * -1,
					targets: cont,
					ease: 'Sine.easeInOut',
					duration: 800,
				})
				.add({
					rotation: 0,
					targets: cont,
					ease: 'Sine.easeInOut',
					duration: 700,
				});

			placed.add(cont);

			timeline.data.forEach((t) => t.on('update', (_: any, __: any, ___: any, current: any) => placed.setChildRotation(cont, current)));
			timeline.play();
		});

		// @ts-expect-error
		const container = this.add.rexContainerLite(
			0, 0,
			this.width, this.height,
			[bg, placed],
		);

		return {
			background: bg,
			papers: placed,
			container,
		};
	}
}

export default Main;
