import React from 'react';

interface IProps {
	children: React.ReactNode;
}

export default function ModalTabContent({ children }: IProps) {
	return (
		<div className="overflow-y-auto rounded-lg border bg-base-100 p-6">
			{children}
		</div>
	);
}
