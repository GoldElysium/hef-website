'use client';

import { Media, Project } from 'types/payload-types';
import ReactPlayer from 'react-player';

interface GalleryItemProps {
	media: Project['media'];
	index: number;
}

export default function GalleryItem({ media, index }: GalleryItemProps) {
	if (!media) return null;
	if (media[index].type === 'video') {
		return (
			<ReactPlayer
				width="100%"
				height="100%"
				key={media[index].id!}
				url={media[index].url!}
				controls
				light
			/>
		);
	} if (media[index].type === 'image') {
		return <img className="max-w-full max-h-full object-contain" key={media[index].id!} src={(media[index].media as Media).sizes!.thumbnail!.url} alt="" loading="lazy" />;
	}
	return <p>Invalid media</p>;
}
