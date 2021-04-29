// Packages
import mongoose, { Schema, Document, Model } from 'mongoose';
import { nanoid } from 'nanoid';

export interface IGuild {
	name: string,
	description: string,
	invite: string,
	debutDate: Date,
}

interface IGuildDocument extends IGuild, Document {}

const SettingSchema: Schema = new Schema({
	_id: { type: String, default: nanoid() },
	name: { type: String, required: true },
	description: { type: String, required: true },
	invite: { type: String, required: true },
	debutDate: { type: Date, required: true },
});

// eslint-disable-next-line import/no-mutable-exports
let model;
try {
	model = mongoose.model<IGuildDocument>('Guild');
} catch {
	model = mongoose.model<IGuildDocument>('Guild', SettingSchema, 'guilds');
}
export default <Model<IGuildDocument>>model;