// Packages
import mongoose, { Schema, Document, Model } from 'mongoose';

interface IMedia {
	type: 'image' | 'video',
	src: string
}

interface ILink {
	name: string,
	link: string,
}

export interface IProject extends Document {
	_id: number,
	status: 'ongoing' | 'past',
	guild: string,
	media?: IMedia[],
	title: string,
	shortDescription: string,
	description: string,
	links?: ILink[],
	date: Date,
}

interface ICounter extends Document {
	_id: string,
	seq: number,
}

const CounterSchema: Schema = new Schema({
	_id: { type: String, required: true },
	seq: { type: Number, default: 0 },
});

let CounterModel: mongoose.Model<ICounter, {}>;
try {
	CounterModel = mongoose.model<ICounter>('Counter');
} catch {
	CounterModel = mongoose.model<ICounter>('Counter', CounterSchema, 'counters');
}

const MediaSchema: Schema = new Schema({
	type: { type: String, enum: ['image', 'video'], required: true },
	src: { type: String, required: true },
});

const LinkSchema: Schema = new Schema({
	name: { type: String, required: true },
	link: { type: String, required: true },
});

const ProjectSchema: Schema = new Schema({
	id: { type: Number },
	status: { type: String, required: true, enum: ['ongoing', 'past'] },
	guild: { type: String, required: true },
	media: { type: [MediaSchema], default: undefined },
	title: { type: String, required: true },
	shortDescription: { type: String, required: true },
	description: { type: String, required: true },
	links: { type: [LinkSchema], default: undefined },
	date: { type: Date, default: new Date() },
});

ProjectSchema.pre('save', (next) => {
	const doc = this;
	CounterModel.findByIdAndUpdate({ _id: 'projectCounter' }, { $inc: { seq: 1 } }, { new: true, upsert: true }, (error: mongoose.Error, counter: ICounter) => { // eslint-disable-line consistent-return
		if (error)
			return next(error);
		// @ts-expect-error doc possibly undefined
		doc._id = counter.seq;
		next();
	});
});

// eslint-disable-next-line import/no-mutable-exports
let model;
try {
	model = mongoose.model<IProject>('Project');
} catch {
	model = mongoose.model<IProject>('Project', ProjectSchema, 'projects');
}
export default <Model<IProject>>model;