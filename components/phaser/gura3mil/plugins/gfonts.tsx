/* eslint-disable class-methods-use-this */
import Phaser from 'phaser';
import WebFont from 'webfontloader';

class GoogleFontsPlugin extends Phaser.Plugins.BasePlugin {
	configure() {
		return new Promise((done) => {
			// eslint-disable-next-line no-undef
			WebFont.load({
				google: {
					families: ['Patrick Hand', 'Gloria Hallelujah'],
				},
				active: done as () => void,
			});
		});
	}
}

export default GoogleFontsPlugin;