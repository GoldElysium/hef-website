import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';
import Project from '../../../models/Project';

// eslint-disable-next-line consistent-return
export default async (req: NextApiRequest, res: NextApiResponse) => {
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

		Project.findByIdAndUpdate(req.body.id, req.body.update, { returnOriginal: false })
			.then((doc) => {
				res.status(200).json(doc);
			})
			.catch((e) => {
				res.status(500).end();
				throw e;
			});
	} else res.status(404).end();
};