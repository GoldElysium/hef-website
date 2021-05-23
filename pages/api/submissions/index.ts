import mongoose from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';
import Submission, { ISubmission } from '../../../models/Submission';

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
	if (req.method === 'PATCH') {
		const session = await getSession({ req });
		if (!session) return res.status(401).end();

		const submissions: ISubmission[] = req.body;

		// eslint-disable-next-line consistent-return
		const updatedSubmissions = await Promise.all(submissions.map(async (submission) => {
			if (!submission._id) {
				const doc = new Submission(submission);
				doc.save((e, newDoc) => {
					if (e) {
						res.status(500).end();
						throw e;
					}
					return newDoc;
				});
			} else {
				return Submission.findByIdAndUpdate(submission._id, submission, {
					returnOriginal: false,
				});
			}
		}));

		return res.status(200).json(updatedSubmissions);
	} res.status(404).end();
};
