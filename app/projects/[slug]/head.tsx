import PayloadResponse from 'types/PayloadResponse';
import { Media, Project } from 'types/payload-types';
import Head from 'ui/Head';

interface ProjectData {
	en: {
		title: string;
		shortDescription: string;
		slug: string;
		image: Media;
	};
	jp: {
		title?: string;
		shortDescription?: string;
	}
}

async function fetchProject(slug: string): Promise<ProjectData> {
	// Fetch EN and JP version for page, CMS will fallback to EN for any fields not translated
	const enProjectRes = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL!}/api/projects?where[slug][equals]=${slug}&depth=2`, {
		headers: {
			'X-RateLimit-Bypass': process.env.PAYLOAD_BYPASS_RATE_LIMIT_KEY ?? '',
		} as Record<string, string>,
	});
	const enProject = (await enProjectRes.json() as PayloadResponse<Project>).docs[0];

	const jpProjectRes = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL!}/api/projects?where[slug][equals]=${slug}&depth=0&locale=jp`, {
		headers: {
			'X-RateLimit-Bypass': process.env.PAYLOAD_BYPASS_RATE_LIMIT_KEY ?? '',
		} as Record<string, string>,
	});
	const jpProject = (await jpProjectRes.json() as PayloadResponse<Project>).docs[0];

	return {
		en: {
			title: enProject.title,
			shortDescription: enProject.shortDescription,
			slug: enProject.slug,
			image: enProject.image as Media,
		},
		jp: {
			title: jpProject.title ?? null,
			shortDescription: jpProject.shortDescription ?? null,
		},
	};
}

export default async function PageHead({ params }: { params: { slug: string } }) {
	const project = await fetchProject(params.slug);

	return (
		<Head
			/* TODO: Make customizable? */
			color="#FF3D3D"
			/* TODO: Use locale */
			title={project.en.title}
			description={project.en.shortDescription}
			keywords={['guratanabata']}
			image={(project.en.image as Media).sizes?.thumbnail?.url ?? 'https://holoen.fans/img/logo.png'}
		/>
	);
}
