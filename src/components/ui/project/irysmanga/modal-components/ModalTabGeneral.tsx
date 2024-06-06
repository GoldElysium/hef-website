import CreditBlock from './CreditBlock';
import ModalTabContent from './ModalTabContent';
import { useMangaContext } from '../context/MangaContext';

function ModalTabGeneral() {
	const { manga } = useMangaContext();
	return (
		<ModalTabContent>
			<h1 className="mb-4 text-4xl font-bold">
				HiRys! Happy 3rd Anniversary!
			</h1>
			<p className="mb-4">
				Can you believe it&apos;s already been 3 years? Time really
				flies! It&apos;s been an incredible journey filled with
				memorable moments and achievements. As the IRyStocrats,
				we&apos;ve joined forces to commemorate this special occasion by
				creating a manga just for you! We hope you enjoy it!
			</p>
			<h2 className="mb-4 text-3xl font-bold underline">Credits</h2>
			<div className="grid w-full lg:grid-cols-2 lg:grid-rows-2">
				<CreditBlock
					label="Authors"
					contributors={manga.authors}
				/>
				<CreditBlock
					label="Artists"
					contributors={manga.artists}
				/>
				<CreditBlock
					label="Translators"
					contributors={manga.translators}
				/>
				<CreditBlock
					label="Programmers"
					contributors={manga.devs}
				/>
			</div>
		</ModalTabContent>
	);
}

export default ModalTabGeneral;
