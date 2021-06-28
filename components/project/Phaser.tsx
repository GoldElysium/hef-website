import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

// eslint-disable-next-line max-len
interface IProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	scene?: any;
	config?: Phaser.Types.Core.GameConfig;
	width?: number;
	height?: number;
	data?: any;
}

const Links = ({
	id, scene, config = {}, width, height, data = {},
}: IProps) => {
	const router = useRouter();

	useEffect(() => {
		const fixedConfig = {
			...config,
		};

		(async () => {
			const Phaser = await import('phaser');

			if (typeof scene === 'string') {
				switch (scene) {
					case 'gura3mil': {
						const info = await import('../phaser/gura3mil');
						Object.assign(fixedConfig, {
							scene: info.default,
							plugins: info.plugins,
						});
						break;
					}

					default: break;
				}
			}

			const game = new Phaser.Game({
				type: Phaser.WEBGL,
				parent: id ?? 'game',
				scale: {
					width: width ?? 2474,
					height: height ?? 1200,
					mode: Phaser.Scale.FIT,
					autoCenter: Phaser.Scale.CENTER_BOTH,
				},
				scene,
				...(fixedConfig),
			});
			if (!game.device.os.desktop) game.scale.setGameSize(1920, 1080);
			game.registry.set('data', data);

			const handler = () => {
				game.destroy(true);
				router.events.off('routeChangeStart', handler);
			};
			router.events.on('routeChangeStart', handler);
		})();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return <div id={id ?? 'game'} className="phaser-container h-screen" />;
};

Links.defaultProps = {
	config: undefined,
	width: undefined,
	height: undefined,
	scene: undefined,
	data: undefined,
};

export default Links;
