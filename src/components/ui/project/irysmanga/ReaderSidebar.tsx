import SelectBox from './SelectBox';

function ReaderSidebar() {
	return (
		<div className="flex w-3/12 flex-col px-4 py-2">
			{/* Manga info */}
			<div className="flex flex-col gap-2">
				<div className="flex items-center gap-1">
					<img src="/assets/irysmanga/title.svg" width={30} alt="" />
					<strong>BroRys BL Manga</strong>
				</div>
				<div className="flex items-center gap-1">
					<img
						src="/assets/irysmanga/chapter.svg"
						width={30}
						alt=""
					/>
					<strong>Title for chapter 1</strong>
				</div>
			</div>

			<div className="divider" />
			{/* Chapter and page seletion */}
			<div className="flex flex-col items-center gap-2">
				<SelectBox />
				<SelectBox />
			</div>

			<div className="divider" />
			{/* Reader settings */}
			<div className="flex flex-col gap-2">
				<button className="btn" type="button">
					Single Page
				</button>
				<button className="btn" type="button">
					Fit Height
				</button>
				<button className="btn" type="button">
					Left To Right
				</button>
				<button className="btn" type="button">
					Header Hidden
				</button>
			</div>
		</div>
	);
}

export default ReaderSidebar;
