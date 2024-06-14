import 'server-only';
import NextImage from 'next/image';
import { createHmac } from 'node:crypto';

type Props = Parameters<typeof NextImage>[0] & {
	action?: 'resize' | 'crop' | 'smartcrop'
};

export function getImageUrl({
	src, width, height, quality, action,
}: Omit<Props, 'alt'>): string {
	if (typeof src !== 'string') throw new Error('Cannot optimize static import');

	if (!process.env.IMAGINARY_URL) return src;

	if (src.toLowerCase().endsWith('.gif')) return src;

	if (!width && !height) throw new Error('Width or height must be provided');

	const query = [
		'type=webp',
		'stripmeta=true',
		`quality=${quality ?? 75}`,
	];
	if (width) query.push(`width=${width}`);
	if (height) query.push(`height=${height}`);

	const urlParam = encodeURIComponent(src.replace('localhost', 'host.docker.internal'));

	const hmac = createHmac('sha256', process.env.IMAGINARY_SECRET!)
		.update(`/${action ?? 'resize'}`)
		// Yes, it needs to be sorted. See https://github.com/h2non/imaginary/issues/235#issuecomment-453833712
		// And apparently go doesn't use %20 for spaces...
		.update([
			...query,
			`url=${
				urlParam
					.replace(/%20/g, '+')
					.replace(/\(/g, '%28')
					.replace(/\)/g, '%29')
			}`,
		].sort().join('&'))
		.digest('base64url');

	return `${process.env.IMAGINARY_URL!}/${action ?? 'resize'}?${[...query, `url=${urlParam}`].sort().join('&')}&sign=${hmac}`;
}

export default function Image(props: Props): ReturnType<typeof NextImage> {
	const src = getImageUrl(props);

	return (
		<NextImage
			// eslint-disable-next-line react/jsx-props-no-spreading
			{...props}
			src={src}
		/>
	);
}
