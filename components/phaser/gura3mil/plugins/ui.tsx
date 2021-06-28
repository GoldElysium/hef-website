import Phaser from 'phaser';

export default class UI extends Phaser.Plugins.ScenePlugin {
	text(
		x: number,
		y: number,
		text: string,
		size = 16,
		maxWidth?: number,
		style = {},
		useBBCode = false,
	) {
		// @ts-expect-error Missing type
		return this.scene.add[useBBCode ? 'rexBBCodeText' : 'text'](x, y, text, {
			fontSize: `${size}px`,
			fontWeight: 'bold',
			fontFamily: 'Patrick Hand',
			align: 'center',
			color: 'black',
			wordWrap: {
				width: maxWidth,
				useAdvancedWrap: true,
			},
			...style,
		});
	}

	// eslint-disable-next-line class-methods-use-this
	sleep(ms = 1000) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	// eslint-disable-next-line class-methods-use-this
	clamp(num: number, min: number, max: number) {
		return Math.min(Math.max(num, min), max);
	}

	ensureOrientation() {
		try {
			// Watch for fullscreen and always lock to landscape
			this.game.scale.on('enterfullscreen', () => {
				if (!this.scene.game.device.os.desktop) {
					// eslint-disable-next-line no-empty
					try { this.game.scale.lockOrientation(Phaser.Scale.LANDSCAPE); } catch {}
					// @ts-expect-error
					try { ScreenOrientation.lock('landscape'); } catch {} // eslint-disable-line no-empty
					// eslint-disable-next-line no-empty
					try { window.screen.orientation.lock('landscape'); } catch {}
				}

				const { canvas } = this.game;
				if (!canvas) return;

				canvas.classList.add('canvas-fullscreen');
			}).on('leavefullscreen', () => {
				// eslint-disable-next-line no-empty
				try { this.game.scale.lockOrientation('default'); } catch {}
				// @ts-expect-error
				try { ScreenOrientation.unlock(); } catch {} // eslint-disable-line no-empty
				// eslint-disable-next-line no-empty
				try { window.screen.orientation.unlock(); } catch {}

				const { canvas } = this.game;
				if (!canvas) return;

				canvas.classList.remove('canvas-fullscreen');
			});
			// Force fullscreen
			this.game.scale.startFullscreen();
		} catch {
			console.warn('Cannot lock orientation');
		}
	}

	// eslint-disable-next-line class-methods-use-this
	getPage(t: number, each: number, total = 10) {
		let page = 1;
		// eslint-disable-next-line no-plusplus
		for (let i = 1; i <= total; i++) {
			if (i * each >= t) {
				page = i;
				break;
			}
		}

		return page;
	}

	// eslint-disable-next-line class-methods-use-this
	shuffle(a: any[]) {
		let j;
		let x;

		// eslint-disable-next-line no-plusplus
		for (let i = a.length - 1; i > 0; i--) {
			j = Math.floor(Math.random() * (i + 1));
			x = a[i];
			// eslint-disable-next-line no-param-reassign
			a[i] = a[j];
			// eslint-disable-next-line no-param-reassign
			a[j] = x;
		}

		return a;
	}

	// eslint-disable-next-line class-methods-use-this
	convertTo2D(array = [], row = 2) {
		const newArr = [];
		while (array.length) newArr.push(array.splice(0, row));

		return newArr;
	}
}
