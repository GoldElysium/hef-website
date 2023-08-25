import { Icon } from '@mdi/react';
import { mdiGithub, mdiTwitter, mdiYoutube } from '@mdi/js';
import { useMemo } from 'react';

export interface ProjectCreditProps {
	credit: {
		type: 'artwork' | 'code' | 'music' | 'organization';
		user: string;
		pfp: string;
		github?: string;
		twitter?: string;
		youtube?: string;
	},
}

export default function ProjectCredit({ credit }: ProjectCreditProps) {
	const socials = useMemo(() => {
		const temp = [];

		if (credit.youtube) temp.push({ type: 'youtube', link: credit.youtube });
		if (credit.twitter) temp.push({ type: 'twitter', link: credit.twitter });
		if (credit.github) temp.push({ type: 'github', link: credit.github });

		return temp;
	}, [credit]);

	return (
		<div className="mx-8 my-4 flex h-max w-32 flex-col items-center justify-start text-black dark:text-white">
			{/* Below eslint error is caused by "Profile picture" */}
			{/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
			<img className="m-4 inline w-32 rounded-full" src={credit.pfp} alt={`Profile picture of ${credit.user}`} />

			<div className="flex h-full flex-col items-start justify-center">
				<div className="flex h-full flex-col items-center justify-center md:flex-row">
					<span className="text-2xl">{credit.user}</span>
					<span className="flex flex-row items-center">
						{socials.map(({ type, link }, index) => (
							((type === 'youtube') && (
								// eslint-disable-next-line react/no-array-index-key
								<a className="ml-2 cursor-pointer" href={`https://youtube.com/${link}`} key={`credit-link-${index}`}>
									<Icon path={mdiYoutube} title="Youtube Channel" size={1} />
								</a>
							)) || ((type === 'twitter') && (
								// eslint-disable-next-line react/no-array-index-key
								<a className="ml-2 cursor-pointer" href={`https://twitter.com/${link}`} key={`credit-link-${index}`}>
									<Icon path={mdiTwitter} title="Twitter Account" size={1} />
								</a>
							)) || ((type === 'github') && (
								// eslint-disable-next-line react/no-array-index-key
								<a className="ml-2 cursor-pointer" href={`https://github.com/${link}`} key={`credit-link-${index}`}>
									<Icon path={mdiGithub} title="GitHub Profile" size={1} />
								</a>
							))
						))}
					</span>
				</div>
			</div>
		</div>
	);
}
