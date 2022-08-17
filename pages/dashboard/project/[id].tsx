import { signIn, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ProjectEditPage from '../../../components/ProjectEditPage';
import { IProject } from '../../../models/Project';

export default function GuildEdit() {
	const { data: session, status } = useSession();
	const loading = status === 'loading';

	const [doc, setDoc] = useState<IProject | null>(null);
	const router = useRouter();

	useEffect(() => { // eslint-disable-line consistent-return
		if (!loading && !session) signIn('discord');
	}, [session, loading]);

	useEffect(() => {
		async function run() {
			if (session && router.query.id !== 'new') {
				const res = await fetch(`/api/projects/${router.query.id}`);
				const data = await res.json() as IProject;
				setDoc(data);
			}
		}
		run();
	}, [router.query.id, session]);

	if (!doc && router.query.id !== 'new') return <div>Loading...</div>;

	return (
		session ? <ProjectEditPage doc={router.query.id !== 'new' ? doc as IProject : undefined} /> : null
	);
}
