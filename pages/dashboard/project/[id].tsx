import { signIn, useSession } from 'next-auth/client';
import { useEffect } from 'react';
import { GetServerSideProps } from 'next';
import ProjectEditPage from '../../../components/ProjectEditPage';
import Project, { IProject } from '../../../models/Project';

interface IProps {
	doc?: string
}

export default function GuildEdit({ doc }: IProps) {
	const [session, loading] = useSession();

	useEffect(() => { // eslint-disable-line consistent-return
		if (!loading && !session) signIn('discord');
	}, [session, loading]);

	return (
		<>
			{session ? <ProjectEditPage doc={doc ? JSON.parse(doc) as IProject : undefined} /> : <></>}
		</>
	);
}
export const getServerSideProps: GetServerSideProps = async (context) => {
	if (context.params?.id && context.params?.id !== 'new') {
		const doc = await Project.findById(context.params.id).lean().exec()
			.catch(() => {
				return {
					props: {
						doc: null,
					},
				};
			});

		if (!doc) return {
			notFound: true,
		};

		return {
			props: {
				doc: JSON.stringify(doc),
			},
		};
	}
	return {
		props: {
			doc: null,
		},
	};

};