// Packages
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISubmission {
	project: number,
	author?: string,
	type: 'image' | 'video' | 'text',
	src?: string,
	message?: string,
}

interface ISubmissionDocument extends Document,ISubmission {}

const SubmissionSchema: Schema = new Schema({
	project: { type: Number, required: true },
	author: { type: String },
	type: { type: String, enum: ['image', 'video', 'text'] },
	src: { type: String },
	message: { type: String }
});

let model;
try {
	model = mongoose.model<ISubmissionDocument>('Submission');
} catch {
	model = mongoose.model<ISubmissionDocument>('Submission', SubmissionSchema, 'submissions');
}
export default <Model<ISubmissionDocument>>model;