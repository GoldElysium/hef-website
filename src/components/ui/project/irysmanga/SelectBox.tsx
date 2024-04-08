function SelectBox() {
	return (
		<div className="flex w-full justify-center">
			<button className="btn" aria-label="left-page" type="button">
				<img src="/assets/irysmanga/left.svg" width={20} alt="" />
			</button>
			<select className="select grow">
				<option>Chapter 1</option>
				<option>Chapter 2</option>
				<option>Chapter 3</option>
				<option>Chapter 4</option>
			</select>
			<button className="btn" aria-label="right-page" type="button">
				<img src="/assets/irysmanga/right.svg" width={20} alt="" />
			</button>
		</div>
	);
}

export default SelectBox;
