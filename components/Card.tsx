export default function Card() {
	return (
		<div className="mt-4 sm:w-1/3">
			<div
				className="bg-white p-8 h-full border-b-4 border-red-500 rounded-lg flex flex-col items-center sm:mx-2 sm:p-3 md:p-8">
				<img className="h-32" src="/img/logo.png" alt="Server logo"/>
				<h2 className="font-bold text-xl mt-3">HoloRes</h2>
				<p className="text-center mt-2">A fun Hololive community! We have concerts, arts, festivals, and more!</p>
				<div className="rounded-3xl bg-red-500 text-white font-bold w-20 h-10 flex items-center justify-center mt-4 content-end hover:text-red-200">
					<a href="#">Join!</a>
				</div>
			</div>
		</div>
	)
}