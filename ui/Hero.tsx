export default function Hero() {
	return (
		<div className="w-full px-4 py-2 flex justify-center h-52 items-center bg-skin-background-2 dark:bg-skin-dark-background-2">
			<div className="max-w-4xl flex flex-col sm:flex-row justify-between w-full sm:items-end">
				<div className="flex flex-col">
					<h1 className="text-2xl text-bold text-white">
						Hololive EN Fan Server
					</h1>
					<p className="text-white text-opacity-80">
						A place to chat with other fans of Hololive English! If you want to
						hang out, you&lsquo;ve come to the right place.
					</p>
				</div>
				<div
					className="rounded-3xl text-xl font-bold w-20 h-10 flex items-center justify-center mt-4 content-end
					bg-white text-skin-primary-1 hover:text-opacity-70 dark:bg-skin-dark-secondary-1 dark:text-white"
				>
					<a
						href="https://discord.gg/holoenfans"
						target="_blank"
						rel="noreferrer"
					>
						Join!
					</a>
				</div>
			</div>
		</div>
	);
}
