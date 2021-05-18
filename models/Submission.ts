// Packages
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISubmission extends Document {
	project: number,
	author?: string,
	type: 'image' | 'video' | 'text',
	src?: string,
	message?: string,
}

const SubmissionSchema: Schema = new Schema({
	project: { type: Number, required: true },
	author: { type: String },
	type: { type: String, enum: ['image', 'video', 'text'] },
	src: { type: String },
	message: { type: String }
});

// eslint-disable-next-line import/no-mutable-exports
let model;
try {
	model = mongoose.model<ISubmission>('Submission');
} catch {
	model = mongoose.model<ISubmission>('Submission', SubmissionSchema, 'submissions');
}
export default <Model<ISubmission>>model;