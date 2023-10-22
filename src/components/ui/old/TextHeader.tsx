import { ReactNode } from 'react';

export default function TextHeader({ children }: { children: ReactNode }) {
	return (
		<h2
			className="mb-10 text-center text-4xl font-extrabold text-skin-text dark:text-skin-text-dark sm:text-left"
		>
			{children}
		</h2>
	);
}
