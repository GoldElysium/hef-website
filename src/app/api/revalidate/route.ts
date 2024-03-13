import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

// eslint-disable-next-line import/prefer-default-export
export async function POST(req: NextRequest) {
	if (req.headers.get('Authorization') !== process.env.REVALIDATE_SECRET) {
		return new NextResponse(undefined, { status: 401 });
	}

	const body = await req.json();

	if (!body.path) {
		return new NextResponse(undefined, { status: 400 });
	}

	revalidatePath(body.path, 'layout');

	return new NextResponse();
}
