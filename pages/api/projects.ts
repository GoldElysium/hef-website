import type { NextApiRequest, NextApiResponse } from 'next';

export default (req: NextApiRequest, res: NextApiResponse) => {
	res.status(200).send('Sub to Suisei https://youtu.be/IKKar5SS29E');
};