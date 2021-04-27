import { signIn, signOut, useSession } from 'next-auth/client';
import { useEffect } from 'react';
import DashboardNavbar from '../components/DashboardNavbar';

export default function DashboardPage() {
	const [session, loading] = useSession();

	// @ts-expect-error Not assignable
	useEffect(() => { // eslint-disable-line consistent-return
		if (loading) return <></>;
		if (!loading && !session) signIn('discord');
	}, [loading, session]);

	return (
		<div>
			<DashboardNavbar />
		</div>
	);
}