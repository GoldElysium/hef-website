export default function Hero() {
	return (
		<div className="bg-red-500 w-full text-white px-4 py-2 flex justify-center h-52 items-center">
			<div className="max-w-4xl flex flex-col sm:flex-row justify-between w-full sm:items-end">
				<div className="flex flex-col">
					<h1 className="text-2xl text-bold">Hololive EN Fan Server</h1>
					<p className="text-red-100">A place to chat with other fans of Hololive English! If you want to hang out, you've come to the right place.</p>
				</div>
				<div className="rounded-3xl bg-white text-red-500 text-xl font-bold w-20 h-10 flex items-center justify-center mt-4 content-end hover:text-red-700">
					<a href="https://discord.gg/holoenfans" target="_blank" rel="noreferrer">Join!</a>
				</div>
			</div>
		</div>
	);
}