import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import Card from '../../components/Card';

export default function Projects() {
	const router = useRouter();
	const { query } = router;

	const [filter, setFilter] = useState([] as string[]);
	const [filterMenuOpen, setFilterMenuOpen] = useState(false);

	const [pastFilter, setPastFilter] = useState([] as string[]);
	const [pastFilterMenuOpen, setPastFilterMenuOpen] = useState(false);

	useEffect(() => {
		if (query.server) {
			setFilter([query.server as string]);
			setPastFilter([query.server as string]);
		}
	}, [query]);

	return (
		<div className="flex flex-col h-full min-h-screen bg-red-50">
			<Navbar/>

			<Header title="Projects" description="A list of all the projects organized by Hololive EN Fan servers!"/>
			<div className="flex-grow">
				<div className="my-16 w-full flex flex-col items-center">
					<div className="max-w-4xl mx-4">
						<div>
							<h1 className="text-2xl text-red-500 font-bold border-b-2 border-red-200 text-center sm:text-left">Ongoing
							projects</h1>
							<div className="flex flex-col sm:flex-row sm:flex-wrap sm:-mx-2">
								<Card img="/img/logo.png" title="HoloRes"
							      description="A fun Hololive community! We have concerts, arts, festivals, and more!"
							      button="Join!" url="#"/>
								<Card img="/img/logo.png" title="HoloRes"
							      description="A fun Hololive community! We have concerts, arts, festivals, and more!"
							      button="Join!" url="#"/>
								<Card img="/img/logo.png" title="HoloRes"
							      description="A fun Hololive community! We have concerts, arts, festivals, and more!"
							      button="Join!" url="#"/>
							</div>
						</div>
						<div className="mt-10">
							<h1 className="text-2xl text-red-500 font-bold border-b-2 border-red-200 text-center sm:text-left">Past
							projects</h1>
							<div className="flex flex-col sm:flex-row sm:flex-wrap sm:-mx-2">
								<Card img="/img/logo.png" title="HoloRes"
							      description="A fun Hololive community! We have concerts, arts, festivals, and more!"
							      button="Join!" url="#"/>
								<Card img="/img/logo.png" title="HoloRes"
							      description="A fun Hololive community! We have concerts, arts, festivals, and more!"
							      button="Join!" url="#"/>
								<Card img="/img/logo.png" title="HoloRes"
							      description="A fun Hololive community! We have concerts, arts, festivals, and more!"
							      button="Join!" url="#"/>
								<Card img="/img/logo.png" title="HoloRes"
							      description="A fun Hololive community! We have concerts, arts, festivals, and more!"
							      button="Join!" url="#"/>
								<Card img="/img/logo.png" title="HoloRes"
							      description="A fun Hololive community! We have concerts, arts, festivals, and more!"
							      button="Join!" url="#"/>
								<Card img="/img/logo.png" title="HoloRes"
							      description="A fun Hololive community! We have concerts, arts, festivals, and more!"
							      button="Join!" url="#"/>
							</div>
						</div>
					</div>
				</div>
			</div>

			<Footer/>
		</div>
	);
}