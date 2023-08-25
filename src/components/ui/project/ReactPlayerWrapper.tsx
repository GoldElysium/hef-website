'use client';

import ReactPlayer from 'react-player';

export default function ReactPlayerWrapper(props: any) {
	return (
		<ReactPlayer
			// eslint-disable-next-line react/jsx-props-no-spreading
			{...props}
		/>
	);
}
