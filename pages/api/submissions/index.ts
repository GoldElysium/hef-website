import mongoose, { ObjectId } from 'mongoose';
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
	const session = await getSession({ req });
	if (!session) return res.status(401).end();

	if (req.method === 'PATCH') {
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
				return await Submission.findByIdAndUpdate(submission._id, submission, {
					returnOriginal: false,
				}).catch((e) => {
					res.status(500).end();
					throw e;
				});
			}
		}));

		return res.status(200).json(updatedSubmissions);
	} if (req.method === 'DELETE') {
		const ids: ObjectId[] = req.body;

		await Promise.all(ids.map(async (id) => {
			await Submission.findByIdAndDelete(id).exec()
				.catch((e) => {
					res.status(500).end();
					throw e;
				});
		}));

		return res.status(204).end();
	} res.status(404).end();
};
