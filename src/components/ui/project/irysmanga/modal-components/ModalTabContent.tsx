import React, { forwardRef } from 'react';

interface IProps {
	children: React.ReactNode;
}

const ModalTabContent = forwardRef<HTMLDivElement, IProps>(({ children }, ref) => (
	<div
		className="modal-content relative overflow-y-auto overflow-x-hidden border-y-[2px] p-6"
		ref={ref}
	>
		{children}
	</div>
));

ModalTabContent.displayName = 'ModalTabContent';

export default ModalTabContent;
