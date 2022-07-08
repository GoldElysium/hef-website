/* tslint:disable */
/**
 * This file was automatically generated by Payload CMS.
 * DO NOT MODIFY IT BY HAND. Instead, modify your source Payload config,
 * and re-run `payload generate:types` to regenerate this file.
 */

export interface Config {}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "featured-projects".
 */
export interface FeaturedProjects {
	id: string;
	projects?: (string | Project)[];
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "projects".
 */
export interface Project {
	id: string;
	_status?: 'draft' | 'published';
	title: string;
	slug: string;
	shortDescription: string;
	description: {
		[k: string]: unknown;
	}[];
	organizer: string | Guild;
	status: 'draft' | 'ongoing' | 'past';
	links?: {
		name: string;
		url: string;
		id?: string;
	}[];
	media?: {
		type: 'image' | 'video';
		media?: string | Media;
		url?: string;
		id?: string;
	}[];
	date: string;
	image: string | Media;
	'submission-url'?: string;
	collaborators?: (string | User)[];
	flags?: (string | Flag)[];
	createdAt: string;
	updatedAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "guilds".
 */
export interface Guild {
	id: string;
	_status?: 'draft' | 'published';
	name: string;
	description: string;
	debutDate: string;
	invite: string;
	icon: string | Media;
	staff?: (string | User)[];
	createdAt: string;
	updatedAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "media".
 */
export interface Media {
	id: string;
	url?: string;
	filename?: string;
	mimeType?: string;
	filesize?: number;
	width?: number;
	height?: number;
	sizes?: {
		icon?: {
			url?: string;
			width?: number;
			height?: number;
			mimeType?: string;
			filesize?: number;
			filename?: string;
		};
		thumbnail?: {
			url?: string;
			width?: number;
			height?: number;
			mimeType?: string;
			filesize?: number;
			filename?: string;
		};
	};
	createdAt: string;
	updatedAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "users".
 */
export interface User {
	id: string;
	email?: string;
	resetPasswordToken?: string;
	resetPasswordExpiration?: string;
	enableAPIKey?: boolean;
	apiKey?: string;
	apiKeyIndex?: string;
	_verified?: boolean;
	_verificationToken?: string;
	loginAttempts?: number;
	lockUntil?: string;
	name: string;
	roles: ('superadmin' | 'project-owner' | 'content-moderator' | 'developer' | 'translator')[];
	createdAt: string;
	updatedAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "flags".
 */
export interface Flag {
	id: string;
	name: string;
	createdAt: string;
	updatedAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "notice".
 */
export interface NoticeBanner {
	id: string;
	enabled?: boolean;
	description?: string;
	message?: {
		[k: string]: unknown;
	}[];
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "submission-media".
 */
export interface SubmissionMedia {
	id: string;
	url?: string;
	filename?: string;
	mimeType?: string;
	filesize?: number;
	width?: number;
	height?: number;
	sizes?: {
		icon?: {
			url?: string;
			width?: number;
			height?: number;
			mimeType?: string;
			filesize?: number;
			filename?: string;
		};
		thumbnail?: {
			url?: string;
			width?: number;
			height?: number;
			mimeType?: string;
			filesize?: number;
			filename?: string;
		};
	};
	createdAt: string;
	updatedAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "submissions".
 */
export interface Submission {
	id: string;
	_status?: 'draft' | 'published';
	project: string | Project;
	author: string;
	srcIcon?: string | SubmissionMedia;
	type: 'text' | 'image' | 'video';
	message?: string;
	media?: string | SubmissionMedia;
	url?: string;
	createdAt: string;
	updatedAt: string;
}
