import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.headers.authorization !== process.env.REVALIDATE_SECRET) return res.status(401).end();
	if (req.method !== 'POST') return res.status(404).end();

	if (!req.body.path) return res.status(400).end();

	await res.revalidate(req.body.path);
	return res.status(200).end();
};
