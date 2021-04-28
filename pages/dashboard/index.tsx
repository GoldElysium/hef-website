import { signIn, useSession } from 'next-auth/client';
import { useEffect } from 'react';
import { PlusIcon } from '@heroicons/react/solid';
import Link from 'next/link';
import DashboardNavbar from '../../components/DashboardNavbar';
import Footer from '../../components/Footer';
import DashboardCard from '../../components/DashboardCard';

export default function DashboardPage() {
	const [session, loading] = useSession();

	// @ts-expect-error Not assignable
	useEffect(() => { // eslint-disable-line consistent-return
		if (loading || !session) return <></>;
		if (!loading && !session) signIn('discord');
	}, [loading, session]);

	return (
		<div className="flex flex-col h-full min-h-screen bg-red-50">
			<DashboardNavbar />
			
			<div className="flex-grow">
				<div className="my-16 w-full flex flex-col items-center">
					<div className="max-w-4xl w-full mx-4">
						<div>
							<div className="flex border-b-2 border-red-200 justify-between items-center text-red-500">
								<h1 className="text-2xl font-bold text-center sm:text-left">Server list</h1>
								<Link href="/dashboard/guild/new">
									<a><PlusIcon className="w-8 h-8 mt-2 hover:text-red-700 cursor-pointer"/></a>
								</Link>
							</div>
							<div className="flex flex-col sm:flex-row sm:flex-wrap sm:-mx-2 sm:justify-center items-center">
								<DashboardCard img="/img/logo.png" title="HEFS" description="" button="Edit" url="#" />
							</div>
						</div>

						<div className="mt-4">

							<div className="flex border-b-2 border-red-200 justify-between items-center text-red-500">
								<h1 className="text-2xl font-bold text-center sm:text-left">Ongoing projects</h1>
								<Link href="/dashboard/project/new">
									<a><PlusIcon className="w-8 h-8 mt-2 hover:text-red-700 cursor-pointer"/></a>
								</Link>
							</div>
							<div className="flex flex-col sm:flex-row sm:flex-wrap sm:-mx-2 sm:justify-center items-center">
								<DashboardCard img="/img/logo.png" title="HEFS" description="" button="Edit" url="#" />
							</div>
						</div>

						<div className="mt-4">
							<h1 className="text-2xl text-red-500 font-bold border-b-2 border-red-200 text-center sm:text-left">Past projects</h1>
							<div className="flex flex-col sm:flex-row sm:flex-wrap sm:-mx-2 sm:justify-center items-center">
								<DashboardCard img="/img/logo.png" title="HEFS" description="" button="Edit" url="#" />
							</div>
						</div>
						<div className="mt-4">
							<h1 className="text-2xl text-red-500 font-bold border-b-2 border-red-200 text-center sm:text-left">Settings</h1>
							<div className="flex flex-col sm:flex-row sm:flex-wrap sm:-mx-2 sm:justify-center items-center">
								<div className="mt-4 sm:w-1/3">
									<div
										className="bg-white p-8 h-full border-b-4 border-red-500 rounded-lg flex flex-col items-center sm:mx-2 sm:p-3 md:p-8">
										<h2 className="font-bold text-xl mt-3">Whitelist</h2>
										<p className="text-center mt-2">Input</p>
										<PlusIcon className="w-8 h-8 mt-2 hover:text-gray-500 cursor-pointer"/>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<Footer/>
		</div>
	);
}