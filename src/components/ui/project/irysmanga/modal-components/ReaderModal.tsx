import { RefObject, useState } from 'react';
import { languages } from '@/lib/i18n/settings';
import { LanguageIcon, XMarkIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';
import ModalTab from './ModalTab';
import ModalTabGeneral from './ModalTabGeneral';
import ModalTabStory from './ModalTabStory';
import ModalTabReader from './ModalTabReader';
import { getNextOption } from '../utils/helper';
import { useMangaContext } from '../context/MangaContext';
import ThemeController from './ThemeController';
import styles from '../styles/Sidebar.module.css';
import ModalTabLisences from './ModalTabLisences';

interface IProps {
	modalRef: RefObject<HTMLDialogElement>;
}

export default function ReaderModal({ modalRef }: IProps) {
	const [selected, setSelected] = useState('General');
	const { readerLanguage, setReaderLanguage } = useMangaContext();
	const options = ['General', 'Story', 'Reader', 'Lisences'];
	return (
		<dialog id="info_modal" className="modal" ref={modalRef}>
			<div className="modal-box relative flex h-[90%] min-w-[50%] max-w-[70%] flex-col justify-between overflow-hidden">
				<XMarkIcon
					onClick={() => modalRef.current?.close()}
					className={classNames(styles.xButton, 'absolute right-4 top-4')}
					width={30}
				/>
				<div className="flex max-h-[87%] grow flex-col">
					<div className="tabs-lifted flex self-center">
						<ModalTab
							label={options[0]}
							selected={selected}
							setSelected={setSelected}
						/>
						<ModalTab
							label={options[1]}
							selected={selected}
							setSelected={setSelected}
						/>
						<ModalTab
							label={options[2]}
							selected={selected}
							setSelected={setSelected}
						/>
						<ModalTab
							label={options[3]}
							selected={selected}
							setSelected={setSelected}
						/>
					</div>

					{selected === 'General' && <ModalTabGeneral />}
					{selected === 'Story' && <ModalTabStory />}
					{selected === 'Reader' && <ModalTabReader />}
					{selected === 'Lisences' && <ModalTabLisences />}
				</div>
				<div className="modal-action flex items-center justify-between">
					<div className="self-start">
						<ThemeController />
					</div>
					<div className="flex gap-1 self-end">
						<button
							type="button"
							className="flex h-12 min-h-12 items-center gap-2 whitespace-nowrap rounded-md bg-skin-primary p-4 text-sm font-semibold leading-4 text-skin-primary-foreground transition-all hover:bg-[color-mix(in_srgb,rgb(var(--color-primary))_90%,black)] disabled:cursor-not-allowed disabled:bg-[color-mix(in_srgb,rgb(var(--color-primary))_90%,black)] dark:bg-skin-primary-dark dark:text-skin-primary-foreground-dark dark:hover:bg-[color-mix(in_srgb,rgb(var(--color-primary-dark))_90%,black)]"
							onClick={() => setReaderLanguage(getNextOption(readerLanguage, languages))}
						>
							<LanguageIcon width="1rem" />
							{readerLanguage.toLocaleUpperCase()}
						</button>
					</div>
				</div>
			</div>
			<form method="dialog" className="modal-backdrop">
				<button type="submit" className="hover:cursor-default">
					Close
				</button>
			</form>
		</dialog>
	);
}
