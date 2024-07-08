import { revalidateTag } from 'next/cache';

// eslint-disable-next-line import/prefer-default-export
export async function POST(req: Request) {
	if (req.headers.get('Authorization') !== process.env.REVALIDATE_SECRET) {
		return new Response(undefined, { status: 401 });
	}

	const body = await req.json();

	if (!body.tag) {
		return new Response(undefined, { status: 400 });
	}

	revalidateTag(body.tag);

	return new Response();
}

export const dynamic = 'force-dynamic';
