import ModalTabContent from './ModalTabContent';

function ModalTabReader() {
	return (
		<ModalTabContent>
			<h1 className="mb-4 text-3xl font-bold">
				Welcome to the Irys-Themed Manga Reader!
			</h1>
			<p className="mb-4">
				In order to show the manga, we built our very own Irys-themed
				reader! Here&apos;s a quick guide to help you get started and
				make the most of your reading experience.
			</p>
			<h2 className="mb-2 text-2xl font-semibold">
				How to Use the Manga Reader:
			</h2>
			<ul className="mb-4 list-inside list-disc">
				<li>
					Turning Pages: You can easily turn the page by clicking
					anywhere on the current page. It&apos;s as simple as that!
				</li>
				<li>
					Sidebar Settings: The sidebar on the right holds various
					settings to enhance your reading experience. Things such as
					language, current chapter, page layout, reader theme, etc.
					Can be customized through here.
				</li>
				<li>
					Making more space: If you want more screen space, you can
					close the sidebar by clicking the top icon on the top right
					corner of the sidebar (or if you&apos;re on mobile, you can
					click anywhere outside the bar to close it). You can also
					close the header from one of the settings.
				</li>
			</ul>
			<h2 className="mb-2 text-2xl font-semibold">Keyboard Shortcuts:</h2>
			<ul className="grid list-inside list-disc grid-cols-1 min-[920px]:grid-cols-2 min-[1360px]:grid-cols-3">
				<li>
					Page Turn:
					{' '}
					<kbd className="kbd kbd-sm">→</kbd>
					{' '}
					or
					{' '}
					<kbd className="kbd kbd-sm">←</kbd>
				</li>
				<li>
					Page Scroll:
					{' '}
					<kbd className="kbd kbd-sm">↑</kbd>
					{' '}
					or
					{' '}
					<kbd className="kbd kbd-sm">↓</kbd>
				</li>
				<li>
					Chapter Turn:
					{' '}
					<kbd className="kbd kbd-sm">,</kbd>
					{' '}
					or
					{' '}
					<kbd className="kbd kbd-sm">.</kbd>
				</li>
				<li>
					Change Manga Language:
					{' '}
					<kbd className="kbd kbd-sm">J</kbd>
				</li>
				<li>
					Change Reader Language:
					{' '}
					<kbd className="kbd kbd-sm">K</kbd>
				</li>

				<li>
					Change Page Direction:
					{' '}
					<kbd className="kbd kbd-sm">D</kbd>
				</li>
				<li>
					Open/Close Sidebar:
					{' '}
					<kbd className="kbd kbd-sm">M</kbd>
				</li>
				<li>
					Open/Close Header
					{' '}
					<kbd className="kbd kbd-sm">H</kbd>
				</li>
				<li>
					Change Theme:
					{' '}
					<kbd className="kbd kbd-sm">T</kbd>
				</li>
				<li>
					Change Page Layout:
					{' '}
					<kbd className="kbd kbd-sm">S</kbd>
				</li>
				<li>
					Change Page Fit Mode:
					{' '}
					<kbd className="kbd kbd-sm">F</kbd>
				</li>
				<li>
					Show/Hide Progress:
					{' '}
					<kbd className="kbd kbd-sm">P</kbd>
				</li>
			</ul>
		</ModalTabContent>
	);
}

export default ModalTabReader;
