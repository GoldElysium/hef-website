import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';
import mongoose from 'mongoose';
import Project from '../../../models/Project';

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
		const project = await Project.findById(req.query.id).exec()
			.catch(() => {
				res.status(500).end();
			});

		if (!project) return res.status(404).end();

		res.status(200).json(project);
	} else if (req.method === 'PATCH') {
		const session = await getSession({ req });
		if (!session) return res.status(401).end();

		Project.findByIdAndUpdate(req.query.id, req.body, { returnOriginal: false })
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

		Project.findByIdAndDelete(req.query.id)
			.then(() => {
				res.status(204).end();
			})
			.catch((e) => {
				res.status(500).end();
				throw e;
			});
	} else res.status(404).end();
};