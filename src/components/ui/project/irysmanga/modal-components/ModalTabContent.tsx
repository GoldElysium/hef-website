import React from 'react';

interface IProps {
	children: React.ReactNode;
}

export default function ModalTabContent({ children }: IProps) {
	return (
		<div className="modal-content relative overflow-y-auto border-y-[2px] p-6">
			{children}
		</div>
	);
}
