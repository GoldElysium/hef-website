import mongoose from 'mongoose';
import NextAuth, { DefaultProfile } from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
import type { NextApiRequest, NextApiResponse } from 'next';

import Setting from '../../../models/Setting';

interface DiscordProfile extends DefaultProfile {
	id: string,
	username: string,
	discriminator: string,
}

try {
	mongoose.connect(<string>process.env.MONGOOSEURL);
// eslint-disable-next-line no-empty
} catch (e) {}

const options = {
	database: process.env.NEXTAUTH_DB,
	providers: [
		DiscordProvider({
			clientId: process.env.DISCORD_CLIENT_ID,
			clientSecret: process.env.DISCORD_CLIENT_SECRET,
			authorization: 'https://discord.com/api/oauth2/authorize?scope=identify',
		}),
	],
	callbacks: {
		async signIn({ profile }: { profile: DiscordProfile }) {
			if (profile.id === process.env.ADMINID) return true;
			const whitelistDoc = await Setting.findById('whitelist').exec()
				.catch((e) => {
					throw e;
				});
			if (!whitelistDoc) {
				const newDoc = new Setting({
					_id: 'whitelist',
					value: [],
				});
				newDoc.save();
				return false;
			}

			const whitelist: string[] = whitelistDoc.value;
			return whitelist.includes(profile.id);
		},
	},
	jwt: {
		signingKey: process.env.JWT_SIGNING_PRIVATE_KEY,
	},
	secret: process.env.AUTHSECRET,
};

// @ts-expect-error options not assignable to NextAuth's profile
const requestHandler = (req: NextApiRequest, res: NextApiResponse) => NextAuth(req, res, options);

export default requestHandler;
