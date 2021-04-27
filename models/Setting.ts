// Packages
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISetting extends Document {
	_id: string,
	value: any,
}

const SettingSchema: Schema = new Schema({
	_id: { type: String, required: true },
	value: { type: Schema.Types.Mixed },
});

// eslint-disable-next-line import/no-mutable-exports
let model;
try {
	model = mongoose.model<ISetting>('Setting');
} catch {
	model = mongoose.model<ISetting>('Setting', SettingSchema, 'settings');
}
export default <Model<ISetting>>model;