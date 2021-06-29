import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

// eslint-disable-next-line max-len
interface IProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	scene?: any;
	config?: Phaser.Types.Core.GameConfig;
	width?: number;
	height?: number;
	data?: any;
}

const Links = ({
	id, scene, config = {}, width, height, data = {}, title,
}: IProps) => {
	const router = useRouter();
	const [isMobile, setMobile] = useState(false);
	const [hideText, setHide] = useState(false);

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
					width: width ?? 2480,
					height: height ?? 1200,
					mode: Phaser.Scale.FIT,
					autoCenter: Phaser.Scale.CENTER_BOTH,
				},
				scene,
				...(fixedConfig),
			});
			if (!game.device.os.desktop) {
				game.scale.setGameSize(1920, 1080);
				setMobile(true);
				setHide(game.scale.isLandscape);

				game.scale.on('orientationchange', (o: string) => {
					if (o === Phaser.Scale.PORTRAIT) {
						setHide(false);
					} else if (o === Phaser.Scale.LANDSCAPE) {
						setHide(true);
					}
				});
			}
			game.registry.set('data', data);

			const handler = () => {
				game.destroy(true);
				router.events.off('routeChangeStart', handler);
			};
			router.events.on('routeChangeStart', handler);
		})();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			{title && (
				<Head>
					<title>{title}</title>
				</Head>
			)}

			{isMobile && !hideText && <p className="text-center">Tap the canvas to fullscreen</p>}
			<div id={id ?? 'game'} className="w-screen h-screen overflow-hidden" />
		</>
	);
};

Links.defaultProps = {
	config: undefined,
	width: undefined,
	height: undefined,
	scene: undefined,
	data: undefined,
};

export default Links;
