import { revalidatePath } from 'next/cache';

// eslint-disable-next-line import/prefer-default-export
export async function POST(req: Request) {
	if (req.headers.get('Authorization') !== process.env.REVALIDATE_SECRET) {
		return new Response(undefined, { status: 401 });
	}

	const body = await req.json();

	if (!body.path) {
		return new Response(undefined, { status: 400 });
	}

	revalidatePath(body.path);

	return new Response();
}

export const dynamic = 'force-dynamic';
