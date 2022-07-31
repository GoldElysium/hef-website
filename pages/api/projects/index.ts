import { getSession } from 'next-auth/react';
import mongoose from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next';
import Project from '../../../models/Project';

try {
	mongoose.connect(<string>process.env.MONGOOSEURL);
// eslint-disable-next-line no-empty
} catch (e) {}

// eslint-disable-next-line consistent-return
export default async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method === 'GET') {
		const projects = await Project.find({}).exec()
			.catch(() => {
				res.status(500).end();
			});

		res.status(200).json(projects);
	} else if (req.method === 'POST') {
		const session = await getSession({ req });
		if (!session) return res.status(401).end();

		const project = new Project(req.body);

		project.save((err) => {
			if (err) {
				res.status(500).end();
				return;
			}

			res.revalidate('/');
			res.revalidate('/projects');
			res.revalidate(`/projects/${project._id}`);

			res.status(201).json(project);
		});
	} else res.status(404).end();
};
