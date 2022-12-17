interface IProps {
	title?: string;
	description?: string;
	url?: string;
	image?: string;
	color?: string;
	keywords?: string[];
}

const defaultProps = {
	title: 'HoloEN Fan Website',
	description: 'A website featuring amazing projects organized by the community!',
	url: 'https://holoen.fans',
	image: 'https://holoen.fans/img/logo.png',
	color: '#FF3D3D',
	keywords: [],
};

export default function Head({
	title, description, url, image, color, keywords = [],
}: IProps = defaultProps) {
	return (
		<>
			<title>{title ?? defaultProps.title}</title>
			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			<meta charSet="UTF-8" />

			<meta name="keywords" content={[...(keywords ?? []), 'hololive en', 'hef', 'hololive fan', 'hololive en fan'].join(', ')} />
			<meta name="subject" content="Hololive EN Fan Website" />
			<meta name="author" content="GoldElysium" />
			<meta name="description" content={description ?? defaultProps.description} />
			<meta name="theme-color" content={color ?? defaultProps.color} />
			<meta name="url" content={url ?? defaultProps.url} />
			<meta name="language" content="EN" />

			<meta name="og:title" content={title ?? defaultProps.title} />
			<meta name="og:type" content="website" />
			<meta name="og:url" content={url ?? defaultProps.url} />
			<meta name="og:site_name" content="HEF" />
			<meta name="og:description" content={description ?? defaultProps.description} />
			<meta name="og:image" content={image ?? defaultProps.image} />

			<meta name="twitter:card" content="summary_large_image" />
			<meta name="twitter:title" content={title ?? defaultProps.title} />
			<meta name="twitter:image" content={image ?? defaultProps.image} />
			<meta name="twitter:description" content={description ?? defaultProps.description} />
			<meta name="twitter:site" content="@HEFSdiscord" />
			<meta name="twitter:creator" content="@goldelysium" />
		</>
	);
}
