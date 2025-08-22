'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { Slant as Hamburger } from 'hamburger-react';
import { useState } from 'react';
import DarkModeToggleMobile from '@/components/ui/DarkModeToggleMobile';

export default function MobileNav() {
	const [isOpen, setIsOpen] = useState(false);
	const [isInnerToggled, setIsInnerToggled] = useState(false);

	return (
		<Dialog.Root open={isOpen}>
			<Dialog.Trigger>
				<Hamburger
					toggled={isOpen}
					toggle={setIsOpen}
					onToggle={() => {
						setTimeout(() => {
							setIsInnerToggled(true);
						}, 1);
					}}
				/>
			</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Overlay className="fixed inset-0 z-40 size-full bg-skin-header/50 backdrop-blur-2xl dark:bg-skin-header-dark/50 dark:text-skin-header-foreground" />
				<Dialog.Content className="fixed inset-0 z-50 text-skin-header-foreground dark:text-skin-header-foreground-dark">
					<Dialog.Title />
					<div className="flex h-20 w-full items-center justify-end bg-skin-header px-4 text-skin-header-foreground dark:bg-skin-header-dark dark:text-skin-header-foreground-dark sm:px-8">
						<Hamburger
							toggled={isInnerToggled}
							toggle={setIsOpen}
							onToggle={() => {
								setIsInnerToggled(false);
							}}
						/>
					</div>
					<div className="relative grid size-full place-items-center px-12 font-semibold">
						<div className="flex w-full justify-between">
							<nav className="flex flex-col gap-4 text-2xl">
								{/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
								<a
									href="#"
									onClick={() => {
										setIsInnerToggled(false);
										setIsOpen(false);
									}}
								>
									TOP
								</a>
								<a
									href="#submissions"
									onClick={() => {
										setIsInnerToggled(false);
										setIsOpen(false);
									}}
								>
									Submissions
								</a>
								<a
									href="#credits"
									onClick={() => {
										setIsInnerToggled(false);
										setIsOpen(false);
									}}
								>
									Credits
								</a>
							</nav>
						</div>
						<div className="fixed bottom-12 right-8">
							<DarkModeToggleMobile />
						</div>
					</div>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
