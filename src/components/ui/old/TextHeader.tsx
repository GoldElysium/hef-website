import { ReactNode } from 'react';

export default function TextHeader({ children }: { children: ReactNode }) {
	return (
		<h2
			className="text-skin-primary-1 dark:text-skin-dark-primary-1 border-skin-primary-1 dark:border-skin-dark-primary-1 mb-6 border-b-2
			border-opacity-30 text-center text-2xl font-bold dark:border-opacity-40 sm:text-left"
		>
			{children}
		</h2>
	);
}
