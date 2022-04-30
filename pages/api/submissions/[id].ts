import mongoose from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next';
import Submission from '../../../models/Submission';

try {
	mongoose.connect(<string>process.env.MONGOOSEURL);
// eslint-disable-next-line no-empty
} catch (e) {}

const requestHandler = async (req: NextApiRequest, res: NextApiResponse) => {
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

export default requestHandler;