'use client';

import BlurBackground from 'ui/project/guratanabata/BlurBackground';
import { createRef, useMemo } from 'react';
import Phaser from 'ui/project/guratanabata/Phaser';

export default function PhaserWrapper({ data }: { data?: object } = { data: {} }) {
	const ref = useMemo(() => createRef<BlurBackground>(), []);

	return (
		<>
			<BlurBackground ref={(bg) => { (ref as any).current = bg; }} />
			<Phaser
				scene="guratanabata"
				data={{
					setBackgroundImage: (to: string) => ref.current?.setBackgroundImage(to),
					...data,
				}}
			/>
		</>
	);
}
