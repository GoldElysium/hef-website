import { signIn, useSession } from 'next-auth/client';
import { useEffect } from 'react';
import DashboardPage from '../../components/DashboardPage';

export default function Dashboard() {
	const [session, loading] = useSession();

	useEffect(() => { // eslint-disable-line consistent-return
		if (!loading && !session) signIn('discord');
	}, [session, loading]);

	return (
		<>
			{session ? <DashboardPage /> : <></>}
		</>
	);
}