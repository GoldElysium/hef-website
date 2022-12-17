import React, { Fragment } from 'react';
import escapeHTML from 'escape-html';
import { Text } from 'slate';

const serialize = (children: any[]) => children.map((node, i) => {
	if (Text.isText(node)) {
		// eslint-disable-next-line react/no-danger
		let text = <span dangerouslySetInnerHTML={{ __html: escapeHTML(node.text) }} />;

		/* eslint-disable react/no-array-index-key */
		// @ts-ignore
		if (node.bold) {
			text = (
				<strong key={`description-strong-${i}`} className="text-black dark:text-gray-300 font-bold">
					{text}
				</strong>
			);
		}

		// @ts-ignore
		if (node.code) {
			text = (
				<code key={`description-code-${i}`} className="text-black dark:text-gray-300 font-mono">
					{text}
				</code>
			);
		}

		// @ts-ignore
		if (node.italic) {
			text = (
				<em key={`description-em-${i}`} className="text-black dark:text-gray-300 italic">
					{text}
				</em>
			);
		}

		// Handle other leaf types here...

		return (
			<Fragment key={`description-fragment-${i}`}>
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
					<h1 key={`description-h1-${i}`} className="text-skin-primary-1 dark:text-skin-dark-primary-1 text-3xl sm:text-5xl font-semibold text-center my-8">
						{serialize(node.children)}
					</h1>
					<div className="h-0.5 w-full bg-skin-primary-1 dark:bg-skin-dark-primary-1 opacity-30 my-4" />
				</>
			);
		case 'h2':
			return (
				<>
					<h2 key={`description-h2-${i}`} className="text-skin-primary-1 dark:text-skin-dark-primary-1 text-xl sm:text-2xl font-semibold my-4">
						{serialize(node.children)}
					</h2>
					<div className="h-0.5 w-full bg-skin-primary-1 dark:bg-skin-dark-primary-1 opacity-30 my-4" />
				</>
			);
		case 'h3':
			return (
				<>
					<h2 key={`description-h3-${i}`} className="text-skin-primary-1 dark:text-skin-dark-primary-1 text-lg sm:text-xl font-semibold my-4">
						{serialize(node.children)}
					</h2>
					<div className="h-0.5 w-full bg-skin-primary-1 dark:bg-skin-dark-primary-1 opacity-30 my-4" />
				</>
			);
		case 'h4':
			return (
				<>
					<h2 key={`description-h4-${i}`} className="text-skin-primary-1 dark:text-skin-dark-primary-1 text-lg font-semibold my-2">
						{serialize(node.children)}
					</h2>
					<div className="h-0.5 w-full bg-skin-primary-1 dark:bg-skin-dark-primary-1 opacity-30 my-2" />
				</>
			);
		case 'h5':
			return (
				<>
					<h2 key={`description-h5-${i}`} className="text-skin-primary-1 dark:text-skin-dark-primary-1 text-base font-semibold my-2">
						{serialize(node.children)}
					</h2>
					<div className="h-0.5 w-full bg-skin-primary-1 dark:bg-skin-dark-primary-1 opacity-30 my-2" />
				</>
			);
		case 'h6':
			return (
				<>
					<h2 key={`description-h6-${i}`} className="text-skin-primary-1 dark:text-skin-dark-primary-1 text-base font-semibold my-2">
						{serialize(node.children)}
					</h2>
					<div className="h-0.5 w-full bg-skin-primary-1 dark:bg-skin-dark-primary-1 opacity-30 my-2" />
				</>
			);
		case 'quote':
			return (
				<blockquote key={`description-quote-${i}`} className="text-black dark:text-gray-300">
					{serialize(node.children)}
				</blockquote>
			);
		case 'ul':
			return (
				<ul key={`description-ul-${i}`} className="text-black dark:text-gray-300">
					{serialize(node.children)}
				</ul>
			);
		case 'ol':
			return (
				<ol key={`description-ol-${i}`} className="text-black dark:text-gray-300">
					{serialize(node.children)}
				</ol>
			);
		case 'li':
			return (
				<li key={`description-li-${i}`} className="text-black dark:text-gray-300">
					{serialize(node.children)}
				</li>
			);
		case 'link':
			return (
				<a
					href={escapeHTML(node.url)}
					key={`description-link-${i}`}
					className="text-skin-link dark:text-skin-dark-link"
				>
					{serialize(node.children)}
				</a>
			);

		default:
			return (
				<p key={`description-p-${i}`} className="text-black dark:text-gray-300">
					{serialize(node.children)}
				</p>
			);
	}
});

export default serialize;
