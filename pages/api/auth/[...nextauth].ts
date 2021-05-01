import mongoose from 'mongoose';
import NextAuth, { Account, DefaultProfile, User } from 'next-auth';
import Providers from 'next-auth/providers';
import type { NextApiRequest, NextApiResponse } from 'next';

import Setting from '../../../models/Setting';

interface DiscordProfile extends DefaultProfile {
	id: string,
	username: string,
	discriminator: string,
}

try {
	mongoose.connect(<string>process.env.MONGOOSEURL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
	});
// eslint-disable-next-line no-empty
} catch (e) {}

const options = {
	database: process.env.NEXTAUTH_DB,
	providers: [
		Providers.Discord({
			clientId: process.env.DISCORD_CLIENT_ID,
			clientSecret: process.env.DISCORD_CLIENT_SECRET,
		}),
	],
	callbacks: {
		async signIn(user: User, account: Account, profile: DiscordProfile) {
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
export default (req: NextApiRequest, res: NextApiResponse) => NextAuth(req, res, options);