// Packages
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMedia {
	type: 'image' | 'video' | 'text',
	src?: string,
	message?: string,
}

export interface ILink {
	name: string,
	link: string,
}

export interface IProject {
	_id?: number,
	status: 'ongoing' | 'past',
	guild: string,
	media?: IMedia[],
	title: string,
	shortDescription: string,
	description: string,
	links?: ILink[],
	date: Date,
	flags?: string[],
	ogImage?: string,
}

interface IProjectDocument extends IProject, Document {
	_id: number,
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

const GallerySchema: Schema = new Schema({
	type: { type: String, enum: ['image', 'video', 'text'], required: true },
	src: { type: String },
	message: { type: String },
});

const LinkSchema: Schema = new Schema({
	name: { type: String, required: true },
	link: { type: String, required: true },
});

const ProjectSchema: Schema = new Schema({
	_id: { type: Number },
	status: { type: String, required: true, enum: ['ongoing', 'past'] },
	guild: { type: String, required: true },
	media: { type: [GallerySchema], default: undefined },
	title: { type: String, required: true },
	shortDescription: { type: String, required: true },
	description: { type: String, required: true },
	links: { type: [LinkSchema], default: undefined },
	date: { type: Date, default: new Date() },
	flags: { type: [String], default: undefined },
	ogImage: { type: String },
});

// eslint-disable-next-line func-names
ProjectSchema.pre('save', function (next) {
	const doc = this;
	CounterModel.findByIdAndUpdate({ _id: 'projectCounter' }, { $inc: { seq: 1 } }, { new: true, upsert: true }, (error, counter: ICounter) => { // eslint-disable-line consistent-return
		if (error) { return next(error); }
		doc._id = counter.seq;
		next();
	});
});

let model;
try {
	model = mongoose.model<IProjectDocument>('Project');
} catch {
	model = mongoose.model<IProjectDocument>('Project', ProjectSchema, 'projects');
}
export default <Model<IProjectDocument>>model;
