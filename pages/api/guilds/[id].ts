import { getSession } from 'next-auth/react';
import mongoose from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next';
import Guild from '../../../models/Guild';

try {
	mongoose.connect(<string>process.env.MONGOOSEURL);
// eslint-disable-next-line no-empty
} catch (e) {}

const requestHandler = async (req: NextApiRequest, res: NextApiResponse) => {
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

		await Guild.findByIdAndUpdate(req.query.id, req.body, { returnOriginal: false })
			.then((doc) => {
				res.status(200).json(doc);
			})
			.catch((e) => {
				res.status(500).end();
				throw e;
			});
	} else if (req.method === 'DELETE') {
		const session = await getSession({ req });
		if (!session) return res.status(401).end();

		await Guild.findByIdAndDelete(req.query.id)
			.then(() => {
				res.status(204).end();
			})
			.catch((e) => {
				res.status(500).end();
				throw e;
			});
	} else res.status(404).end();
};

export default requestHandler;
