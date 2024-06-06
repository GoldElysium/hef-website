import React from 'react';

interface Props {
	children: React.ReactNode;
}
function ModalTabContent({ children }: Props) {
	return (
		<div className="overflow-y-auto rounded-lg border bg-base-100 p-6">
			{children}
		</div>
	);
}

export default ModalTabContent;
