import mongoose from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next';
import Submission from '../../../models/Submission';

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
	if (Number.isNaN(Number(req.query.id))) return res.status(404).end();
	if (req.method === 'GET') {
		const submissions = await Submission.find({
			project: Number.parseInt(req.query.id as string, 10),
		}).lean().exec()
			.catch(() => {
				res.status(500).end();
			});

		if (!submissions) return res.status(404).end();

		res.status(200).json(submissions);
	} else res.status(404).end();
};
