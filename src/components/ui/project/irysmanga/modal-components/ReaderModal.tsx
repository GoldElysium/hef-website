import { RefObject, useState } from 'react';
import ModalTab from './ModalTab';
import ModalTabGeneral from './ModalTabGeneral';
import ModalTabStory from './ModalTabStory';
import ModalTabReader from './ModalTabReader';
import { getNextOption } from '../utils/helper';

interface Props {
	modalRef: RefObject<HTMLDialogElement>;
}

function ReaderModal({ modalRef }: Props) {
	const [selected, setSelected] = useState('General');
	return (
		<dialog id="info_modal" className="modal" ref={modalRef}>
			<div className="modal-box flex h-[90%] min-w-[50%] max-w-[70%] flex-col justify-between overflow-hidden">
				<div className="flex max-h-[87%] grow flex-col">
					<div className="tabs-lifted flex self-center">
						<ModalTab
							label="General"
							selected={selected}
							setSelected={setSelected}
						/>
						<ModalTab
							label="Story"
							selected={selected}
							setSelected={setSelected}
						/>
						<ModalTab
							label="Reader"
							selected={selected}
							setSelected={setSelected}
						/>
					</div>

					{selected === 'General' && (
						<ModalTabGeneral />
					)}
					{selected === 'Story' && <ModalTabStory />}
					{selected === 'Reader' && <ModalTabReader />}
				</div>
				<div className="modal-action">
					{/* eslint-disable */}
                    <button
                        className="btn"
                        onClick={() =>
                            selected === "Reader"
                                ? modalRef.current?.close()
                                : setSelected(
                                      getNextOption(selected, [
                                          "General",
                                          "Story",
                                          "Reader",
                                      ])
                                  )
                        }
                    >
                        {selected === "Reader" ? "Close" : "Next"}
                    </button>
                    {/* // eslint-enable */}
                </div>
            </div>
            <form method="dialog" className="modal-backdrop">
                {/* eslint-disable */}
                {/* // eslint-enable */}
                <button className="hover:cursor-default">close</button>
            </form>
        </dialog>
	);
}

export default ReaderModal;
