import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

// eslint-disable-next-line import/prefer-default-export
export async function POST(req: NextRequest) {
	if (req.headers.get('Authorization') !== process.env.REVALIDATE_SECRET) {
		return new NextResponse(undefined, { status: 401 });
	}

	const body = await req.json();

	if (body.tag) {
		return new NextResponse(undefined, { status: 400 });
	}

	revalidateTag(body.tag);

	return new NextResponse();
}
