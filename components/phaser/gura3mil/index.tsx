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
import GoogleFontsPlugin from './plugins/gfonts';
import UIPl from './plugins/ui';

import Main from './main';
import Splash from './splash';

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
		const { width, height } = this.game.canvas;

		this.width = width;
		this.height = height;

		this.scene.add('main', Main);
		this.scene.add('splash', Splash);
		this.scene.bringToTop(this);
	}

	preload() {
		this.load.audio('bgm', '/assets/gura3mil/bgm.mp3');
		this.load.image('info', '/assets/gura3mil/info.webp');
		this.load.image('pause', '/assets/gura3mil/pause.webp');
		this.load.image('play', '/assets/gura3mil/play.webp');

		// @ts-expect-error
		this.load.rexAwait(async (resolve) => {
			const res = await axios.get('https://holodex.net/api/v2/channels/UCoSrY_IQQVpmIRZ9Xf-y93g');
			this.info = res.data;
			this.subCount = parseInt(this.info.subscriber_count, 10);

			resolve();
		});
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

		this.scene.launch('splash', { subCount: this.subCount });

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
	global: [{
		key: 'rexContainerLitePlugin',
		plugin: ContainerLitePlugin,
		start: true,
	},
	{
		key: 'GoogleFontsPlugin',
		plugin: GoogleFontsPlugin,
		mapping: 'googleFonts',
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
	}],
	scene: [{
		key: 'rexUI',
		plugin: UIPlugin,
		mapping: 'rexUI',
	},
	{
		key: 'UI',
		plugin: UIPl,
		mapping: 'ui',
	}],
};
