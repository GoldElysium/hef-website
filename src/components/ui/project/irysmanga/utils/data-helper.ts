import { Manga } from './types';

function getMangaFromDevProps(devProps: { [key: string]: string }): Manga {
	if (!devProps.mangaData) {
		throw new Error('No manga data found.');
	}

	return JSON.parse(devProps.mangaData);
}

export default function getManga(devProps: { [key: string]: string }): Manga {
	return getMangaFromDevProps(devProps);
}
