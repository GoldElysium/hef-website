import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';
import Setting from '../../../models/Setting';

// eslint-disable-next-line consistent-return
export default async (req: NextApiRequest, res: NextApiResponse) => {
	const session = await getSession({ req });
	if (!session) return res.status(401).end();
	
	if (req.method === 'GET') {
		if (!req.query.s) return res.status(400).end();
		const doc = await Setting.findById(req.query.s).lean().exec()
			.catch((e) => {
				res.status(500).end();
				throw e;
			});

		if (!doc) return res.status(404).end();
		res.status(200).json(doc);
	} if (req.method === 'PATCH') {
		if (!req.body.setting || !req.body.value) return res.status(400).end();
		Setting.findByIdAndUpdate(req.body.setting, { value: req.body.value }, { returnOriginal: false })
			.then((doc) => {
				res.status(200).json(doc);
			})
			.catch((e) => {
				res.status(500).end();
				throw e;
			});
	} else res.status(404).end();
};