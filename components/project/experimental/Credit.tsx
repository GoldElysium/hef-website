import { Icon } from '@mdi/react';
import { mdiGithub, mdiTwitter, mdiYoutube } from '@mdi/js';
import { useMemo } from 'react';

import { ICredit } from '../../../models/Project';

export interface ProjectCreditProps {
	credit: ICredit,
}

export default function ProjectCredit({ credit }: ProjectCreditProps) {
	const socials = useMemo(() => {
		const temp = [];

		if (credit.youtube != null) temp.push({ type: 'youtube', link: credit.youtube! });
		if (credit.twitter != null) temp.push({ type: 'twitter', link: credit.twitter! });
		if (credit.github != null) temp.push({ type: 'github', link: credit.github! });

		return temp;
	}, [credit]);

	return (
		<div className="flex flex-col justify-start items-center mx-8 my-4 w-32 h-max text-black dark:text-white">
			{/* Below eslint error is caused by "Profile picture" */}
			{/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
			<img className="inline w-32 m-4 rounded-full" src={credit.pfp} alt={`Profile picture of ${credit.user}`} />

			<div className="flex flex-col justify-center items-start h-full">
				<div className="flex flex-col justify-center items-center md:flex-row h-full">
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
