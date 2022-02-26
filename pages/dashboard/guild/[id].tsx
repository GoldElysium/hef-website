import { signIn, useSession } from 'next-auth/react';
import { useEffect } from 'react';
import GuildEditPage from '../../../components/GuildEditPage';

export default function GuildEdit() {
	const { data: session, status } = useSession();
	const loading = status === 'loading';

	useEffect(() => {
		if (!loading && !session) signIn('discord');
	}, [session, loading]);

	return (
		<>
			{session ? <GuildEditPage /> : <></>}
		</>
	);
}
