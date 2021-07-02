import Phaser from 'phaser';
import axios from 'axios';
// @ts-expect-error Missing types
import SoundFade from 'phaser3-rex-plugins/plugins/soundfade';
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
import Info from './info';

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

	public showingInfo = false;

	init() {
		if (!this.ui) return Router.reload();

		const { width, height } = this.game.canvas;
		this.width = width;
		this.height = height;

		if (
			this.game.device.browser.safari
			|| this.game.device.browser.ie
			|| (this.game.device.os.iOS && this.game.device.os.iOSVersion < 14.4)
		) this.registry.set('useFallback', true);
		else this.registry.set('useFallback', false);

		if (this.game.device.video.webm && this.game.device.video.vp9) {
			this.registry.set('canPlayWebm', true);
		} else {
			this.registry.set('canPlayWebm', false);
		}

		return true;
	}

	preload() {
		const loading = this.ui.text(this.width / 2, this.height / 2, 'Loading...', 32, undefined, {
			color: '#FEFEFE',
		}).setOrigin(0.5, 0.5);

		this.loadPlugins();
		this.load.audio('bgm', '/assets/gura3mil/bgm.mp3');

		this.load.audio('paperslide1', '/assets/gura3mil/sfx/paperslide1.mp3');
		this.load.audio('paperslide2', '/assets/gura3mil/sfx/paperslide2.mp3');
		this.load.audio('paperslide3', '/assets/gura3mil/sfx/paperslide3.mp3');

		if (this.registry.get('canPlayWebm')) this.load.video('gura', '/assets/gura3mil/gura.webm', undefined, true, true);
		else {
			for (let i = 1; i <= 38; i++) {
				this.load.image(`gura-frame${i}`, `/assets/gura3mil/fallback/frames/final-${i.toString().padStart(4, '0')}.png`);
			}
		}

		const urls: Record<string, string> = {};
		(this.registry.values?.data?.submissions ?? [])
			.filter((s: ISubmission) => s.type === 'image')
			.forEach((s: ISubmission) => {
				const key = `submission-image-${s.author}`;

				this.load.image(`${key}-thumb`, s.srcIcon);
				this.load.image(key, s.src ?? s.srcIcon);
				urls[key] = (s.src ?? s.srcIcon) as string;
			});
		this.registry.set('submissionURLs', urls);

		// @ts-expect-error
		this.load.rexAwait(async (resolve) => {
			const res = await axios.get('https://holodex.net/api/v2/channels/UCoSrY_IQQVpmIRZ9Xf-y93g');
			this.info = res.data;
			this.subCount = parseInt(this.info.subscriber_count, 10);
			this.registry.set('subCount', this.subCount);

			const i = this.ui.clamp(Math.floor((this.subCount - 2900000) / 20000) - 1, 0, 4);

			if (!this.registry.get('useFallback')) this.loadDefault(i);
			else this.loadFallback(i);

			resolve();
		});

		this.load.once('complete', () => loading.destroy());
	}

	create() {
		this.addScenes();

		if (!this.registry.get('canPlayWebm')) {
			this.anims.create({
				key: 'gura',
				frames: Array(38).fill(0).map((_, i) => ({ key: `gura-frame${i + 1}` })),
				frameRate: 12,
				repeat: -1,
			});
		}

		this.infoButton = this.add.image(10, this.height, 'info')
			.setOrigin(0, 1)
			.setDepth(5)
			.setScale(0.8)
			.setInteractive({ pixelPerfect: true, cursor: 'pointer' })
			.on('pointerup', () => this.toggleInfo());

		this.bgmControl = this.add.image(this.infoButton.width - 10, this.height, 'play')
			.setOrigin(0, 1)
			.setDepth(5)
			.setScale(0.8)
			.setInteractive({ pixelPerfect: true, cursor: 'pointer' })
			.on('pointerup', () => this.toggleBGM());

		this.input.on('pointerup', async () => {
			if (!this.game.device.os.desktop) {
				this.ui.ensureOrientation();
			}
		});

		this.scene.launch('splash');

		this.sound.once('unlocked', () => {
			try {
				this.bgm = SoundFade.fadeIn(this, 'bgm', 500, 0.2, 0).setLoop(true);
				this.toggleBGM();
				// eslint-disable-next-line no-empty
			} catch {}
		});
	}

	toggleBGM() {
		const ctrl = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.CTRL);
		if (ctrl.isDown) {
			window.open('https://bit.ly/guraTanabata', '_blank', 'noopener noreferrer');
			return ctrl.destroy();
		}

		this.bgmPlaying = !this.bgmPlaying;

		if (this.bgmPlaying) {
			this.bgmControl?.setTexture('pause');
			this.bgm?.resume();
		} else {
			this.bgmControl?.setTexture('play');
			this.bgm?.pause();
		}

		return true;
	}

	toggleInfo() {
		if (this.showingInfo) return (this.scene.get('info') as import('./info').default).close();
		this.showingInfo = true;

		return this.scene.launch('info').get('info').events.once('shutdown', () => { this.showingInfo = false; });
	}

	loadDefault(index: number) {
		this.load.image('info', '/assets/gura3mil/info.webp');
		this.load.image('pause', '/assets/gura3mil/pause.webp');
		this.load.image('play', '/assets/gura3mil/play.webp');
		this.load.image('close', '/assets/gura3mil/close.webp');
		this.load.image('title', '/assets/gura3mil/title.webp');
		this.load.image('back', '/assets/gura3mil/back.webp');
		this.load.image('home', '/assets/gura3mil/home.webp');

		this.load.image('zoomed1', '/assets/gura3mil/zoomedin1.webp');
		this.load.image('zoomed2', '/assets/gura3mil/zoomedin2.webp');
		this.load.image('zoomed3', '/assets/gura3mil/zoomedin3.webp');

		this.load.image('bg', '/assets/gura3mil/bg.webp');
		this.load.image('infoBG', '/assets/gura3mil/infoBackground.webp');

		this.load.image('blue', '/assets/gura3mil/papers/blue.webp');
		this.load.image('orange', '/assets/gura3mil/papers/orange.webp');
		this.load.image('purple', '/assets/gura3mil/papers/purple.webp');
		this.load.image('red', '/assets/gura3mil/papers/red.webp');
		this.load.image('white', '/assets/gura3mil/papers/white.webp');

		this.load.image('bamboo', [
			'/assets/gura3mil/bamboo1.webp',
			'/assets/gura3mil/bamboo2.webp',
			'/assets/gura3mil/bamboo3.webp',
			'/assets/gura3mil/bamboo4.webp',
			'/assets/gura3mil/bamboo5.webp',
		][index]);
	}

	loadFallback(index: number) {
		this.load.image('info', '/assets/gura3mil/fallback/info.png');
		this.load.image('pause', '/assets/gura3mil/fallback/pause.png');
		this.load.image('play', '/assets/gura3mil/fallback/play.png');
		this.load.image('close', '/assets/gura3mil/fallback/close.png');
		this.load.image('title', '/assets/gura3mil/fallback/title.png');
		this.load.image('back', '/assets/gura3mil/fallback/back.png');
		this.load.image('home', '/assets/gura3mil/fallback/home.png');

		this.load.image('zoomed1', '/assets/gura3mil/fallback/zoomedin1.jpg');
		this.load.image('zoomed2', '/assets/gura3mil/fallback/zoomedin2.jpg');
		this.load.image('zoomed3', '/assets/gura3mil/fallback/zoomedin3.jpg');

		this.load.image('bg', '/assets/gura3mil/fallback/bg.jpg');
		this.load.image('infoBG', '/assets/gura3mil/fallback/infoBackground.png');

		this.load.image('blue', '/assets/gura3mil/fallback/papers/blue.png');
		this.load.image('orange', '/assets/gura3mil/fallback/papers/orange.png');
		this.load.image('purple', '/assets/gura3mil/fallback/papers/purple.png');
		this.load.image('red', '/assets/gura3mil/fallback/papers/red.png');
		this.load.image('white', '/assets/gura3mil/fallback/papers/white.png');

		this.load.image('bamboo', [
			'/assets/gura3mil/fallback/bamboo1.png',
			'/assets/gura3mil/fallback/bamboo2.png',
			'/assets/gura3mil/fallback/bamboo3.png',
			'/assets/gura3mil/fallback/bamboo4.png',
			'/assets/gura3mil/fallback/bamboo5.png',
		][index]);
	}

	addScenes() {
		this.scene.add('main', Main);
		this.scene.add('splash', Splash);
		this.scene.add('fullPaper', FullPaper);
		this.scene.add('info', Info);
		this.scene.bringToTop(this);
	}

	loadPlugins() {
		this.load.scenePlugin('rexuiplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js', 'rexUI', 'rexUI');
		this.load.plugin('rexcontainerliteplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexcontainerliteplugin.min.js', true);
		this.load.plugin('rexbbcodetextplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexbbcodetextplugin.min.js', true);
	}
}

export default Index;
export const plugins = {
	global: [
		{
			key: 'GoogleFontsPlugin',
			plugin: GoogleFontsPlugin,
			start: true,
		},
		{
			key: 'rexAwaitLoader',
			plugin: AwaitLoaderPlugin,
			start: true,
		},
		NineSlicePlugin.DefaultCfg,
	],
	scene: [
		{
			key: 'UI',
			plugin: UIPl,
			mapping: 'ui',
		},
	],
};
