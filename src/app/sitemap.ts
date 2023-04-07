/* eslint-disable import/prefer-default-export */
import type { Project } from 'types/payload-types';
import type PayloadResponse from 'types/PayloadResponse';
import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	let projects: Project[] = [];
	let moreProjects = true;
	let page = 1;

	async function fetchNextProjects() {
		// Fetch next page
		const enProjectsRes = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL!}/api/projects?depth=0&limit=100&page=${page}&depth=0`, {
			headers: {
				'X-RateLimit-Bypass': process.env.PAYLOAD_BYPASS_RATE_LIMIT_KEY ?? '',
			} as Record<string, string>,
		});
		const enBody: PayloadResponse<Project> = await enProjectsRes.json();

		projects = projects.concat(enBody.docs);

		// Set variables for next fetch
		page += 1;
		moreProjects = enBody.hasNextPage;
	}

	while (moreProjects) {
		// eslint-disable-next-line no-await-in-loop
		await fetchNextProjects();
	}

	return [
		{
			url: 'https://holoen.fans',
		},
		{
			url: 'https://holoen.fans/projects',
		},
		...projects.map(((project) => ({
			url: `https://holoen.fans/projects/${project.slug}`,
		}))),
	];
}

// Allow revalidation every 30 min
export const revalidate = 30 * 60;
