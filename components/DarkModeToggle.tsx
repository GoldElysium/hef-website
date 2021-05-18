import { DarkModeContext } from '../contexts/DarkModeContext';

export default function DarkModeToggle() {

	return (
		<DarkModeContext.Consumer>
			{({ darkMode, toggleDarkMode }) => (
				<div className="flex flex-nowrap align-middle items-center">
					<label className="switch ml-6">
						<input type="checkbox" onChange={() => toggleDarkMode()} checked={darkMode}/>
						<span className="slider round"/>
					</label>
					<img src="/img/nightMode.svg" alt="Night Mode Icon" className="inline w-8 h-auto ml-2"/>
				</div>
			)}
		</DarkModeContext.Consumer>
	);
}