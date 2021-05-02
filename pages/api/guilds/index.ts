import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';
import mongoose from 'mongoose';
import Guild from '../../../models/Guild';

try {
	mongoose.connect(<string>process.env.MONGOOSEURL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
	});
// eslint-disable-next-line no-empty
} catch (e) {}

// eslint-disable-next-line consistent-return
export default async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method === 'GET') {
		const guilds = await Guild.find({}).exec()
			.catch(() => {
				res.status(500).end();
			});

		res.status(200).json(guilds);
	} else if (req.method === 'POST') {
		const session = await getSession({ req });
		if (!session) return res.status(401).end();

		const guild = new Guild(req.body);

		guild.save((err) => {
			if (err) res.status(500).end();
			else res.status(201).json(guild);
		});
	} else res.status(404).end();
};