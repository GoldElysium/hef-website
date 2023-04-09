/* eslint-disable import/prefer-default-export */
import { Project } from 'types/payload-types';
import PayloadResponse from 'types/PayloadResponse';
import { languages } from '../../lib/i18n/settings';

export async function GET() {
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

	const xml = `\
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
		xmlns:xhtml="http://www.w3.org/1999/xhtml">
	<url>
		<loc>https://holoen.fans</loc>
${languages.map((language) => `\
		<xhtml:link
			rel="alternate"
			hreflang="${language}"
			href="https://holoen.fans/${language}"/>
`).join('')}\
	</url>
	<url>
		<loc>https://holoen.fans/projects</loc>
${languages.map((language) => `\
		<xhtml:link
			rel="alternate"
			hreflang="${language}"
			href="https://holoen.fans/${language}/projects"/>
`).join('')}\
	</url>${projects.map(((project) => `
	<url>
		<loc>https://holoen.fans/projects/${project.slug}</loc>
		<lastmod>${project.updatedAt}</lastmod>
${languages.map((language) => `\
		<xhtml:link
			rel="alternate"
			hreflang="${language}"
			href="https://holoen.fans/${language}/projects/${project.slug}"/>
`).join('')}\
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
