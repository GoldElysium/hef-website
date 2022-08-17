import React from 'react';
import ReactMarkdown from 'react-markdown';
import TextHeader from '../TextHeader';

interface IProps {
	description: string | undefined,
}

function Description({ description }: IProps) {
	if (!description || description.length === 0) return null;

	return (
		<div>
			<TextHeader text="Description" />
			<div className="markdown-body">
				<ReactMarkdown className="px-4 sm:px-0 text-black dark:text-white dark:text-opacity-80">
					{description
						.replace(/(\\\n```)/gim, '\n```')
						.replace(/(```\n\\)|(```\n\n\\)/gim, '```\n')}
				</ReactMarkdown>
			</div>
		</div>
	);
}

export default Description;
