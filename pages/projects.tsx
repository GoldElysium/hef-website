import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Header from '../components/Header';

export default function Projects() {
	const router = useRouter();
	const { query } = router;

	const [filter, setFilter] = useState('');
	const [pastFilter, setPastFilter] = useState('');

	useEffect(() => {
		if (query.server) {
			setFilter(query.server as string);
			setPastFilter(query.server as string);
		}
	}, [query]);

	return (
		<div className="flex flex-col items-center">
			<Navbar/>

			<Header title="Projects" description="A list of all the projects organized by Hololive EN Fan servers!"/>
			<div className="">
				Text
			</div>

			<Footer/>
		</div>
	);
}