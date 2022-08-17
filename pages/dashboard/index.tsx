import { signIn, useSession } from 'next-auth/react';
import { useEffect } from 'react';
import DashboardPage from '../../components/DashboardPage';

export default function Dashboard() {
	const { data: session, status } = useSession();
	const loading = status === 'loading';

	useEffect(() => {
		if (!loading && !session) signIn('discord');
	}, [session, loading]);

	return (
		session ? <DashboardPage /> : null
	);
}
