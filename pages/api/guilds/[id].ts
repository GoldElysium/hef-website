import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';
import Guild from '../../../models/Guild';

// eslint-disable-next-line consistent-return
export default async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method === 'GET') {
		const guild = await Guild.findById(req.query.id).exec()
			.catch(() => {
				res.status(500).end();
			});

		if (!guild) return res.status(404).end();

		res.status(200).json(guild);
	} else if (req.method === 'PATCH') {
		const session = await getSession({ req });
		if (!session) return res.status(401).end();

		Guild.findByIdAndUpdate(req.body.id, req.body.update, { returnOriginal: false })
			.then((doc) => {
				res.status(200).json(doc);
			})
			.catch((e) => {
				res.status(500).end();
				throw e;
			});
	} else res.status(404).end();
};