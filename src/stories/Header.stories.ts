import type { Meta, StoryObj } from '@storybook/react';
import Header from '@/components/ui/old/Header';

const meta: Meta<typeof Header> = {
	title: 'Project/Header',
	component: Header,
	// This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/7.0/react/writing-docs/docs-page
	tags: ['autodocs'],
	parameters: {
		// More on how to position stories at: https://storybook.js.org/docs/7.0/react/configure/story-layout
		layout: 'fullscreen',
	},
	argTypes: {
		background: {
			control: 'file',
		},
	},
};

export default meta;
type Story = StoryObj<typeof Header>;

export const NoBackground: Story = {
	args: {
		title: 'Project',
		description: 'Short description',
		background: undefined,
	},
};

export const WithBackground: Story = {
	args: {
		title: 'Project',
		description: 'This one has a background',
		background: '/assets/sanasendoff/background.webp',
	},
};
