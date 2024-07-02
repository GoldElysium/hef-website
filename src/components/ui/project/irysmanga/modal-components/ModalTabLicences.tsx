import ModalTabContent from './ModalTabContent';

export default function ModalTabLicenses() {
	return (
		<ModalTabContent>
			<h1 className="mb-4 text-3xl font-bold">Licenses</h1>

			<h2 className="mb-2 text-2xl font-semibold">Art Licenses</h2>
			<p className="mb-4">
				Fan Art Guidelines: The artwork in our manga adheres to Cover&apos;s guidelines for
				fanart. For more details, please refer to the
				{' '}
				<a href="link to Cover's guidelines" className="text-blue-500 underline">
					Cover Fanart Guidelines
				</a>
				.
			</p>

			<h2 className="mb-2 text-2xl font-semibold">Font Licenses</h2>

			<h3 className="mb-2 text-xl font-medium">EN Version Fonts</h3>
			<div className="mb-4">
				<h4 className="text-lg font-semibold">Anime Ace 2</h4>
				<p>
					<strong>License:</strong>
					{' '}
					<a
						href="link to Blambot's Indie Comics Use license"
						className="text-blue-500 underline"
					>
						Indie Comics Use
					</a>
					<br />
					<strong>Source:</strong>
					{' '}
					Blambot
				</p>
			</div>

			<h3 className="mb-2 text-xl font-medium">JP Version Fonts</h3>
			<div className="mb-4">
				<h4 className="text-lg font-semibold">BIZ UD 明朝 (Minchou) Medium</h4>
				<p>
					<strong>License:</strong>
					{' '}
					<a href="link to SIL Open Font License 1.1" className="text-blue-500 underline">
						SIL Open Font License 1.1
					</a>
					<br />
					<strong>Source:</strong>
					{' '}
					タイプバンク(TypeBank), モリサワ(Morisawa)
				</p>
			</div>

			<h2 className="mb-2 text-2xl font-semibold">Additional Information</h2>
			<p>
				For any inquiries or further details about the licenses and usage rights, please
				contact us at [contact information].
			</p>
		</ModalTabContent>
	);
}
