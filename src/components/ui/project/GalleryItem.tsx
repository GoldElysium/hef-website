'use client';

import { Media, Project } from '@/types/payload-types';
import ReactPlayer from 'react-player';
import Image from 'next/image';
import useTranslation from '@/lib/i18n/client';

interface GalleryItemProps {
	media: Array<Omit<NonNullable<Required<Project>['media']>[number], 'media'> & { media: Media }>
	index: number;
}

export default function GalleryItem({ media, index }: GalleryItemProps) {
	if (!media) return null;
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const { t } = useTranslation('project', 'submission');

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
	}
	if (media[index].type === 'image') {
		return (
			<Image
				className="max-h-full max-w-full object-contain"
				key={media[index].id!}
				src={media[index].media.url!}
				width={
					media[index].media.width! < 1024 ? media[index].media.width! : 1024
				}
				height={
					media[index].media.width! < 1024
						? media[index].media.height!
						: (media[index].media.height! / media[index].media.width!) * 1024
				}
				alt=""
			/>
		);
	}

	return <p>{t('invalid-media')}</p>;
}
