import NextHead from 'next/head';

interface IProps {
	title?: string;
	description?: string;
	url?: string;
	image?: string;
	color?: string;
	keywords?: string[];
}

export default function Head({
	title, description, url, image, color, keywords = [],
}: IProps) {
	return (
		<NextHead>
			<title>{title}</title>

			<meta name="keywords" content={[...keywords, 'hololive en', 'hef', 'hololive fan', 'hololive en fan'].join(', ')} />
			<meta name="subject" content="Hololive EN Fan Website" />
			<meta name="author" content="GoldElysium" />
			<meta name="description" content={description} />
			<meta name="theme-color" content={color} />
			<meta name="url" content={url} />
			<meta name="language" content="EN" />

			<meta name="og:title" content={title} />
			<meta name="og:type" content="website" />
			<meta name="og:url" content={url} />
			<meta name="og:site_name" content="HEF" />
			<meta name="og:description" content={description} />
			<meta name="og:image" content={image} />

			<meta name="twitter:card" content="summary_large_image" />
			<meta name="twitter:title" content={title} />
			<meta name="twitter:image" content={image} />
			<meta name="twitter:description" content={description} />
			<meta name="twitter:site" content="@HEFSdiscord" />
			<meta name="twitter:creator" content="@goldelysium" />
		</NextHead>
	);
}

Head.defaultProps = {
	title: 'Hololive EN Fan Website',
	description: 'A place to chat with other fans of Hololive English! If you want to hang out, you‘ve come to the right place.',
	url: 'https://holoen.fans',
	image: 'https://holoen.fans/img/logo.png',
	color: '#FF3D3D',
	keywords: [],
};
