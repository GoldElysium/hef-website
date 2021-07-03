import React from 'react';
import TextHeader from '../TextHeader';
import { ILink } from '../../models/Project';

interface IProps {
	links: ILink[] | undefined
}

const Links = ({ links }: IProps) => {
	if (!links || links.length === 0) return <></>;

	return (
		<div className="mt-4">
			<TextHeader text="Links" />
			<div className="flex justify-center space-x-6 px-4 sm:px-0">
				{links.map((link, index) => (
					<div
						key={`link-${index}` /* eslint-disable-line react/no-array-index-key */}
						className="rounded-3xl font-bold w-[6rem] h-10 flex items-center justify-center mt-4 content-end
						bg-skin-secondary-1 dark:bg-skin-dark-secondary-1 text-white hover:text-opacity-70"
					>
						<a href={link.link} target="_blank" rel="noreferrer">
							{link.name}
						</a>
					</div>
				))}
			</div>
		</div>
	);
};

export default Links;
