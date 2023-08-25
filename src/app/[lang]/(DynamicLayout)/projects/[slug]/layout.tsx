import 'styles/sana-timeline.css';
import Navbar from 'components/ui/old/Navbar';
import Footer from 'components/ui/old/Footer';
import PayloadResponse from 'types/PayloadResponse';
import { Flag, Project } from 'types/payload-types';
import ProjectHeader from 'ui/ProjectHeader';

interface IProps {
	children: React.ReactNode;
	params: {
		slug?: string;
	}
}

interface PropsProject {
	flags: string[];
	title: string;
	description: string;
	devprops: Project['devprops'];
}

async function getProject(slug: string): Promise<PropsProject | null> {
	const res = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL!}/api/projects?where[slug][like]=${slug}&depth=2`, {
		headers: {
			'X-RateLimit-Bypass': process.env.PAYLOAD_BYPASS_RATE_LIMIT_KEY ?? undefined,
			Authorization: process.env.PAYLOAD_API_KEY ? `users API-Key ${process.env.PAYLOAD_API_KEY}` : undefined,
		} as Record<string, string>,
		next: {
			tags: [slug],
		},
	});
	const parsedRes = (await res.json() as PayloadResponse<Project>);
	if (parsedRes.totalDocs === 0) return null;

	const project = parsedRes.docs[0];

	return {
		title: project.title,
		description: project.shortDescription,
		flags: (project.flags as Flag[] ?? []).map((flag) => flag.code),
		devprops: project.devprops,
	};
}

export default async function RootLayout({ children, params: { slug } }: IProps) {
	let project: PropsProject | null = null;

	if (slug) {
		project = await getProject(slug);
	}

	return (
		<>
			<Navbar flags={project?.flags ?? []} />
			{
				project && !project.flags.includes('disableHeader') && (
					<ProjectHeader
						title={project.title}
						description={project.description}
						devprops={project.devprops}
					/>
				)
			}
			<main>
				{children}
			</main>
			<Footer flags={project?.flags ?? []} />
		</>
	);
}
