'use client';

import { useRunner } from '@tripetto/runner-react-hook';
import type { IForm } from '@/app/[lang]/(DynamicLayout)/forms/[id]/page';
import { useEffect, useRef } from 'react';
import type { ISnapshot } from '@tripetto/runner';

interface IProps {
	id: string;
	form: IForm;
}

export default function FormRunner({ id, form }: IProps) {
	const {
		storyline,
		snapshot,
	} = useRunner({
		definition: form.form,
		snapshot: JSON.parse(localStorage.getItem(`form-${id}`) || 'null')
			|| undefined,
	}, {
		autoStart: true,
		mode: 'paginated',
	});

	const localSnapshot = useRef({
		data: undefined as ISnapshot<any> | undefined,
		save: () => {
			if (localStorage) {
				if (snapshot) {
					localStorage.setItem(`form-${id}`, JSON.stringify(snapshot));
				} else {
					localStorage.removeItem(`form-${id}`);
				}
			}
		},
	});

	if (typeof window !== 'undefined' && localStorage) {
		localSnapshot.current.data = JSON.parse(localStorage.getItem(`form-${id}`) || 'null')
			|| undefined;
	}

	useEffect(() => {
		window.addEventListener('unload', localSnapshot.current.save);

		return () => {
			window.removeEventListener('unload', localSnapshot.current.save);
		};
	}, []);

	return (
		storyline
		&& !storyline.isEmpty
		&& (
			<>
				{storyline.map((moment, page) => (
					// eslint-disable-next-line react/no-array-index-key
					<div key={`form-page-${page}`}>
						<h1>{moment.section.props.name}</h1>
					</div>
				))}
			</>
		)
	);
}
