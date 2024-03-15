export default function Loading() {
	return (
		<div className="flex h-full min-h-screen flex-col bg-skin-background text-skin-text dark:bg-skin-background-dark dark:text-skin-text-dark">
			<div className="grow">
				<div className="grid h-full place-items-center">
					<p className="py-12 text-3xl">Loading...</p>
				</div>
			</div>
		</div>
	);
}
