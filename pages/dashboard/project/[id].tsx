import { signIn, useSession } from 'next-auth/client';
import { useEffect } from 'react';
import ProjectEditPage from '../../../components/ProjectEditPage';

export default function GuildEdit() {
	const [session, loading] = useSession();

	useEffect(() => { // eslint-disable-line consistent-return
		if (!loading && !session) signIn('discord');
	}, [session, loading]);

	return (
		<>
			{session ? <ProjectEditPage /> : <></>}
		</>
	);
}