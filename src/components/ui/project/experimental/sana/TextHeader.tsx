import { ReactNode } from 'react';

export default function TextHeader({ children }: { children: ReactNode }) {
	return (
		<h2
			className="dark:text-skin-dark-primary dark:border-skin-dark-primary/40 mb-6 border-b-2 border-skin-primary/30 text-center text-2xl font-bold text-skin-primary sm:text-left"
		>
			{children}
		</h2>
	);
}
