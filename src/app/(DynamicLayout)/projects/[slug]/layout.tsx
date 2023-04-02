import 'styles/sana-timeline.css';
import Navbar from 'ui/Navbar';
import Footer from 'ui/Footer';
import PayloadResponse from 'types/PayloadResponse';
import { Flag, Project } from 'types/payload-types';

interface IProps {
	children: React.ReactNode;
	params: {
		slug?: string;
	}
}

async function getFlags(slug: string): Promise<string[]> {
	const res = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL!}/api/projects?where[slug][like]=${slug}&depth=2`, {
		headers: {
			'X-RateLimit-Bypass': process.env.PAYLOAD_BYPASS_RATE_LIMIT_KEY ?? '',
		} as Record<string, string>,
	});
	const parsedRes = (await res.json() as PayloadResponse<Project>);
	if (parsedRes.totalDocs === 0) return [];

	const project = parsedRes.docs[0];

	return (project.flags as Flag[] ?? []).map((flag) => flag.code);
}

export default async function RootLayout({ children, params }: IProps) {
	let flags: string[] = [];

	if (params.slug) {
		flags = await getFlags(params.slug);
	}

	return (
		<>
			{/* @ts-ignore */}
			<Navbar flags={flags} />
			<main>
				{children}
			</main>
			{/* @ts-ignore */}
			<Footer flags={flags} />
		</>
	);
}
