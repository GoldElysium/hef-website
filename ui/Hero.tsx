export default function Hero() {
	return (
		<div className="w-full px-4 py-2 flex justify-center h-52 items-center bg-skin-background-2 dark:bg-skin-dark-background-2">
			<div className="max-w-4xl flex flex-col sm:flex-row justify-between w-full sm:items-end">
				<div className="flex flex-col">
					<h1 className="text-2xl text-bold text-white">
						HoloEN Fan Website
					</h1>
					<p className="text-white text-opacity-80">
						A website featuring amazing projects organized by the community!
					</p>
				</div>
			</div>
		</div>
	);
}
