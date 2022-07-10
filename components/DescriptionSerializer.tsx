import React, { Fragment } from 'react';
import escapeHTML from 'escape-html';
import { Text } from 'slate';

const serialize = (children: any[]) => children.map((node, i) => {
	if (Text.isText(node)) {
		let text = <span dangerouslySetInnerHTML={{ __html: escapeHTML(node.text) }} />;

		// @ts-ignore
		if (node.bold) {
			text = (
				<strong key={i} className="text-black dark:text-gray-300 font-bold">
					{text}
				</strong>
			);
		}

		// @ts-ignore
		if (node.code) {
			text = (
				<code key={i} className="text-black dark:text-gray-300 font-mono">
					{text}
				</code>
			);
		}

		// @ts-ignore
		if (node.italic) {
			text = (
				<em key={i} className="text-black dark:text-gray-300 italic">
					{text}
				</em>
			);
		}

		// Handle other leaf types here...

		return (
			<Fragment key={i}>
				{text}
			</Fragment>
		);
	}

	if (!node) {
		return null;
	}

	switch (node.type) {
		case 'h1':
			return (
				<>
					<h1 key={i} className="text-skin-primary-1 dark:text-skin-dark-primary-1 text-5xl font-semibold text-center my-8">
						{serialize(node.children)}
					</h1>
					<div className="h-0.5 w-full bg-skin-primary-1 dark:bg-skin-dark-primary-1 opacity-30 my-4"></div>
				</>
			);
		case 'h2':
			return (
				<>
					<h2 key={i} className="text-skin-primary-1 dark:text-skin-dark-primary-1 text-2xl font-semibold my-4">
						{serialize(node.children)}
					</h2>
					<div className="h-0.5 w-full bg-skin-primary-1 dark:bg-skin-dark-primary-1 opacity-30 my-4"></div>
				</>
			);
		case 'h3':
			return (
				<>
					<h2 key={i} className="text-skin-primary-1 dark:text-skin-dark-primary-1 text-xl font-semibold my-4">
						{serialize(node.children)}
					</h2>
					<div className="h-0.5 w-full bg-skin-primary-1 dark:bg-skin-dark-primary-1 opacity-30 my-4"></div>
				</>
			);
		case 'h4':
			return (
				<>
					<h2 key={i} className="text-skin-primary-1 dark:text-skin-dark-primary-1 text-lg font-semibold my-2">
						{serialize(node.children)}
					</h2>
					<div className="h-0.5 w-full bg-skin-primary-1 dark:bg-skin-dark-primary-1 opacity-30 my-2"></div>
				</>
			);
		case 'h5':
			return (
				<>
					<h2 key={i} className="text-skin-primary-1 dark:text-skin-dark-primary-1 text-base font-semibold my-2">
						{serialize(node.children)}
					</h2>
					<div className="h-0.5 w-full bg-skin-primary-1 dark:bg-skin-dark-primary-1 opacity-30 my-2"></div>
				</>
			);
		case 'h6':
			return (
				<>
					<h2 key={i} className="text-skin-primary-1 dark:text-skin-dark-primary-1 text-base font-semibold my-2">
						{serialize(node.children)}
					</h2>
					<div className="h-0.5 w-full bg-skin-primary-1 dark:bg-skin-dark-primary-1 opacity-30 my-2"></div>
				</>
			);
		case 'quote':
			return (
				<blockquote key={i} className="text-black dark:text-gray-300">
					{serialize(node.children)}
				</blockquote>
			);
		case 'ul':
			return (
				<ul key={i} className="text-black dark:text-gray-300">
					{serialize(node.children)}
				</ul>
			);
		case 'ol':
			return (
				<ol key={i} className="text-black dark:text-gray-300">
					{serialize(node.children)}
				</ol>
			);
		case 'li':
			return (
				<li key={i} className="text-black dark:text-gray-300">
					{serialize(node.children)}
				</li>
			);
		case 'link':
			return (
				<a
					href={escapeHTML(node.url)}
					key={i}
				>
					{serialize(node.children)}
				</a>
			);

		default:
			return (
				<p key={i} className="text-black dark:text-gray-300">
					{serialize(node.children)}
				</p>
			);
	}
});

export default serialize;
