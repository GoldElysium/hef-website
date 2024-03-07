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
				<strong key={`description-strong-${i}`} className="font-bold text-black dark:text-gray-300">
					{text}
				</strong>
			);
		}

		// @ts-ignore
		if (node.code) {
			text = (
				<code key={`description-code-${i}`} className="font-mono text-black dark:text-gray-300">
					{text}
				</code>
			);
		}

		// @ts-ignore
		if (node.italic) {
			text = (
				<em key={`description-em-${i}`} className="italic text-black dark:text-gray-300">
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
				<h1 key={`description-h1-${i}`} className="my-8 text-center text-3xl font-semibold text-skin-text dark:text-skin-text-dark sm:text-5xl">
					{serialize(node.children)}
				</h1>
			);
		case 'h2':
			return (
				<h2 key={`description-h2-${i}`} className="dark:text-skin-text-darkmy-4 text-xl font-semibold text-skin-text sm:text-2xl">
					{serialize(node.children)}
				</h2>
			);
		case 'h3':
			return (
				<h2 key={`description-h3-${i}`} className="dark:text-skin-text-darkmy-4 text-lg font-semibold text-skin-text sm:text-xl">
					{serialize(node.children)}
				</h2>
			);
		case 'h4':
			return (
				<>
					<h2 key={`description-h4-${i}`} className="dark:text-skin-text-darkmy-2 text-lg font-semibold text-skin-text">
						{serialize(node.children)}
					</h2>
					<div className="dark:bg-skin-dark-primary my-2 h-0.5 w-full bg-skin-primary opacity-30" />
				</>
			);
		case 'h5':
			return (
				<>
					<h2 key={`description-h5-${i}`} className="dark:text-skin-text-darkmy-2 text-base font-semibold text-skin-text">
						{serialize(node.children)}
					</h2>
					<div className="dark:bg-skin-dark-primary my-2 h-0.5 w-full bg-skin-primary opacity-30" />
				</>
			);
		case 'h6':
			return (
				<>
					<h2 key={`description-h6-${i}`} className="dark:text-skin-text-darkmy-2 text-base font-semibold text-skin-text">
						{serialize(node.children)}
					</h2>
					<div className="dark:bg-skin-dark-primary my-2 h-0.5 w-full bg-skin-primary opacity-30" />
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
					className="text-skin-link dark:text-skin-link-dark"
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
