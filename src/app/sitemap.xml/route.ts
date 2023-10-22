/* eslint-disable import/prefer-default-export */
import { Project } from '@/types/payload-types';
import PayloadResponse from '@/types/PayloadResponse';

export async function GET() {
	let projects: Project[] = [];
	let moreProjects = true;
	let page = 1;

	async function fetchNextProjects() {
		// Fetch next page
		const projectsRes = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL!}/api/projects?depth=0&limit=100&page=${page}&depth=0`, {
			headers: {
				'X-RateLimit-Bypass': process.env.PAYLOAD_BYPASS_RATE_LIMIT_KEY ?? undefined,
				Authorization: process.env.PAYLOAD_API_KEY ? `users API-Key ${process.env.PAYLOAD_API_KEY}` : undefined,
			} as Record<string, string>,
		});
		const body: PayloadResponse<Project> = await projectsRes.json();

		projects = projects.concat(body.docs);

		// Set variables for next fetch
		page += 1;
		moreProjects = body.hasNextPage;
	}

	while (moreProjects) {
		// eslint-disable-next-line no-await-in-loop
		await fetchNextProjects();
	}

	const xml = `\
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
		xmlns:xhtml="http://www.w3.org/1999/xhtml">
	<url>
		<loc>https://holoen.fans</loc>
		<xhtml:link
			rel="alternate"
			hreflang="en"
			href="https://holoen.fans/en" />
		<xhtml:link
			rel="alternate"
			hreflang="ja"
			href="https://holoen.fans/jp" />
	</url>
	<url>
		<loc>https://holoen.fans/projects</loc>
		<xhtml:link
			rel="alternate"
			hreflang="en"
			href="https://holoen.fans/en/projects" />
		<xhtml:link
			rel="alternate"
			hreflang="ja"
			href="https://holoen.fans/jp/projects" />
	</url>${projects.map(((project) => `
	<url>
		<loc>https://holoen.fans/projects/${project.slug}</loc>
		<lastmod>${project.updatedAt}</lastmod>
		<xhtml:link
			rel="alternate"
			hreflang="en"
			href="https://holoen.fans/en/projects/${project.slug}" />
		<xhtml:link
			rel="alternate"
			hreflang="ja"
			href="https://holoen.fans/jp/projects/${project.slug}" />
	</url>`)).join('')}
</urlset>\
`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'text/xml',
		},
	});
}

// Allow revalidation every 30 min
export const revalidate = 30 * 60;
