import Image from '@/components/ui/legacy/Image';
import type { ReactNode } from 'react';

export interface Social {
	icon: ReactNode;
	url: string;
}

export interface User {
	name: string;
	role: string;
	pfp: string;
	socials: Social[];
}

export default function UserCard({ user }: { user: User }) {
	return (
		<div className="rounded-md h-72 w-48 py-8 flex flex-col items-center gap-1 bg-skin-secondary dark:bg-skin-secondary-dark text-skin-secondary-foreground dark:text-skin-secondary-foreground-dark">
			<Image
				src={user.pfp}
				width="256"
				height="256"
				alt=""
				className="rounded-full size-24 mb-2 object-cover"
			/>
			<span className="font-bold">{user.name}</span>
			<span>{user.role}</span>
			<div className="flex gap-2 mt-2">
				{user.socials.map((social: Social) => (
					<a key={social.url} href={social.url} target="_blank" rel="noopener noreferrer">
						{social.icon}
					</a>
				))}
			</div>
		</div>
	);
}
