import Phaser from 'phaser';
import axios from 'axios';
// @ts-expect-error Missing types
import SoundFade from 'phaser3-rex-plugins/plugins/soundfade';
// @ts-expect-error Missing types
import BBCodeTextPlugin from 'phaser3-rex-plugins/plugins/bbcodetext-plugin';
// @ts-expect-error Missing types
import UIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin';
// @ts-expect-error Missing types
import ContainerLitePlugin from 'phaser3-rex-plugins/plugins/containerlite-plugin';
// @ts-expect-error Missing types
import PerspectiveImagePlugin from 'phaser3-rex-plugins/plugins/perspectiveimage-plugin';
// @ts-expect-error Missing types
import AwaitLoaderPlugin from 'phaser3-rex-plugins/plugins/awaitloader-plugin';
import Router from 'next/router';
import { Plugin as NineSlicePlugin } from 'phaser3-nineslice';
import { ISubmission } from '../../../models/Submission';
import GoogleFontsPlugin from './plugins/gfonts';
import UIPl from './plugins/ui';

import Main from './main';
import Splash from './splash';
import FullPaper from './fullPaper';

class Index extends Phaser.Scene {
	public bgmPlaying = false;

	public bgm?: Phaser.Sound.WebAudioSound;

	public ui!: import('./plugins/ui').default;

	public info: any;

	public subCount!: number;

	public width!: number;

	public height!: number;

	public infoButton?: Phaser.GameObjects.Image;

	public bgmControl?: Phaser.GameObjects.Image;

	init() {
		if (!this.ui) return Router.reload();

		const { width, height } = this.game.canvas;
		this.width = width;
		this.height = height;

		this.scene.add('main', Main);
		this.scene.add('splash', Splash);
		this.scene.add('fullPaper', FullPaper);
		return this.scene.bringToTop(this);
	}

	preload() {
		const loading = this.ui.text(this.width / 2, this.height / 2, 'Loading...', 32, undefined, {
			color: '#FEFEFE',
		}).setOrigin(0.5, 0.5);
		this.load.image('info', '/assets/gura3mil/info.webp');
		this.load.image('pause', '/assets/gura3mil/pause.webp');
		this.load.image('play', '/assets/gura3mil/play.webp');
		this.load.image('close', '/assets/gura3mil/close.webp');
		this.load.image('title', '/assets/gura3mil/title.webp');
		this.load.image('back', '/assets/gura3mil/back.webp');
		this.load.image('home', '/assets/gura3mil/home.webp');

		this.load.image('zoomed1', '/assets/gura3mil/zoomedin1.webp');
		this.load.image('bg', '/assets/gura3mil/bg.webp');

		this.load.image('blue', '/assets/gura3mil/papers/blue.webp');
		this.load.image('orange', '/assets/gura3mil/papers/orange.webp');
		this.load.image('purple', '/assets/gura3mil/papers/purple.webp');
		this.load.image('red', '/assets/gura3mil/papers/red.webp');
		this.load.image('white', '/assets/gura3mil/papers/white.webp');

		this.load.video('gura', '/assets/gura3mil/gura.webm', undefined, true, true);

		this.load.audio('bgm', '/assets/gura3mil/bgm.mp3');

		this.load.audio('paperslide1', '/assets/gura3mil/sfx/paperslide1.mp3');
		this.load.audio('paperslide2', '/assets/gura3mil/sfx/paperslide2.mp3');
		this.load.audio('paperslide3', '/assets/gura3mil/sfx/paperslide3.mp3');

		(this.registry.values?.data?.submissions ?? [])
			.filter((s: ISubmission) => s.type === 'image')
			.forEach((s: ISubmission) => {
				this.load.image(`submission-image-${s.author}-thumb`, s.srcIcon ?? s.src);
				this.load.image(`submission-image-${s.author}`, s.src ?? s.srcIcon);
			});

		// @ts-expect-error
		this.load.rexAwait(async (resolve) => {
			const res = await axios.get('https://holodex.net/api/v2/channels/UCoSrY_IQQVpmIRZ9Xf-y93g');
			this.info = res.data;
			this.subCount = parseInt(this.info.subscriber_count, 10);
			this.registry.set('subCount', this.subCount);

			const i = this.ui.clamp(Math.floor((this.subCount - 2900000) / 20000) - 1, 0, 4);
			const key = `bamboo${i}`;
			this.load.image(key, [
				'/assets/gura3mil/bamboo1.webp',
				'/assets/gura3mil/bamboo2.webp',
				'/assets/gura3mil/bamboo3.webp',
				'/assets/gura3mil/bamboo4.webp',
				'/assets/gura3mil/bamboo5.webp',
			][i]);

			resolve();
		});

		this.load.once('complete', () => loading.destroy());
	}

	create() {
		this.infoButton = this.add.image(10, this.height, 'info')
			.setOrigin(0, 1)
			.setDepth(5)
			.setScale(0.8)
			.setInteractive({ pixelPerfect: true, cursor: 'pointer' })
			.once('pointerup', () => {
				// TODO: info popup
			});
		this.bgmControl = this.add.image(this.infoButton.width - 10, this.height, 'play')
			.setOrigin(0, 1)
			.setDepth(5)
			.setScale(0.8)
			.setInteractive({ pixelPerfect: true, cursor: 'pointer' })
			.on('pointerup', () => this.toggleBGM());

		this.input.on('pointerup', async () => {
			if (!this.sys.game.device.os.desktop) {
				this.ui.ensureOrientation();
			}
		});

		this.scene.launch('splash');

		this.sound.once('unlocked', () => {
			try {
				this.bgm = SoundFade.fadeIn(this, 'bgm', 500, 0.05, 0).setLoop(true);
				this.toggleBGM();
				// eslint-disable-next-line no-empty
			} catch {}
		});
	}

	toggleBGM() {
		this.bgmPlaying = !this.bgmPlaying;

		if (this.bgmPlaying) {
			this.bgmControl?.setTexture('pause');
			this.bgm?.resume();
		} else {
			this.bgmControl?.setTexture('play');
			this.bgm?.pause();
		}
	}
}

export default Index;
export const plugins = {
	global: [
		{
			key: 'rexContainerLitePlugin',
			plugin: ContainerLitePlugin,
			start: true,
		},
		{
			key: 'GoogleFontsPlugin',
			plugin: GoogleFontsPlugin,
			start: true,
		},
		{
			key: 'rexPerspectiveImagePlugin',
			plugin: PerspectiveImagePlugin,
			start: true,
		},
		{
			key: 'rexAwaitLoader',
			plugin: AwaitLoaderPlugin,
			start: true,
		},
		{
			key: 'rexBBCodeTextPlugin',
			plugin: BBCodeTextPlugin,
			start: true,
		},
		NineSlicePlugin.DefaultCfg,
	],
	scene: [
		{
			key: 'rexUI',
			plugin: UIPlugin,
			mapping: 'rexUI',
		},
		{
			key: 'UI',
			plugin: UIPl,
			mapping: 'ui',
		},
	],
};
