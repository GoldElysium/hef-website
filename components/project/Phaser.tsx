import React, { useEffect } from 'react';

// eslint-disable-next-line max-len
interface IProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	scene?: any;
	config?: Phaser.Types.Core.GameConfig;
	width?: number;
	height?: number;
}

const Links = ({
	id, scene, config = {}, width, height,
}: IProps) => {
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
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const game = new Phaser.Game({
				type: Phaser.WEBGL,
				parent: id ?? 'game',
				scale: {
					width: width ?? 1920,
					height: height ?? 1080,
					mode: Phaser.Scale.FIT,
					autoCenter: Phaser.Scale.CENTER_BOTH,
				},
				scene,
				...(fixedConfig),
			});
		})();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return <div id={id ?? 'game'} />;
};

Links.defaultProps = {
	config: undefined,
	width: 1920,
	height: 1080,
	scene: undefined,
};

export default Links;
