// Packages
import mongoose, { Schema, Document, Model } from 'mongoose';
import { nanoid } from 'nanoid';

export interface IGuild extends Document {
	name: string,
	description: string,
	invite: string,
	debutDate: Date,
}

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
	model = mongoose.model<IGuild>('Guild');
} catch {
	model = mongoose.model<IGuild>('Guild', SettingSchema, 'guilds');
}
export default <Model<IGuild>>model;