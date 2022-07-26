// Packages
import mongoose, {
	Schema, Document, Model, Types,
} from 'mongoose';

export interface ISubmission {
	_id: Types.ObjectId,
	project: number,
	author?: string,
	srcIcon?: string,
	type: 'image' | 'video' | 'text',
	subtype?: 'picture' | 'artwork',
	src?: string,
	message?: string,
}

interface ISubmissionDocument extends Document, ISubmission {
	_id: Types.ObjectId,
}

const SubmissionSchema: Schema = new Schema({
	project: { type: Number, required: true },
	author: { type: String },
	srcIcon: { type: String },
	type: { type: String, enum: ['image', 'video', 'text'] },
	subtype: { type: String, enum: ['picture', 'artwork'] },
	src: { type: String },
	message: { type: String },
});

let model;
try {
	model = mongoose.model<ISubmissionDocument>('Submission');
} catch {
	model = mongoose.model<ISubmissionDocument>('Submission', SubmissionSchema, 'submissions');
}
export default <Model<ISubmissionDocument>>model;
