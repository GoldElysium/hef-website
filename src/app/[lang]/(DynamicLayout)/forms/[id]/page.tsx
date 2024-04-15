import { Form } from '@/types/payload-types';
import type { IDefinition } from '@tripetto/runner';
import { Language } from '@/lib/i18n/languages';
import PayloadResponse from '@/types/PayloadResponse';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import FormRunner from '@/app/[lang]/(DynamicLayout)/forms/[id]/FormRunner';

export interface IForm {
	name: string;
	description: string;
	isSubmissionForm: boolean;
	status: 'open' | 'closed';
	skin: Form['skin'];
	form: IDefinition;
}

interface IProps {
	params: {
		id: string;
		lang: Language;
	};
}

export async function fetchForm(id: string, lang: Language): Promise<IForm | null> {
	const res = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL!}/api/forms?where[id][equals]=${id}&depth=0&locale=${lang}&fallback-locale=en`, {
		headers: {
			'X-RateLimit-Bypass': process.env.PAYLOAD_BYPASS_RATE_LIMIT_KEY ?? undefined,
			Authorization: process.env.PAYLOAD_API_KEY ? `users API-Key ${process.env.PAYLOAD_API_KEY}` : undefined,
		} as Record<string, string>,
		next: {
			tags: [id],
		},
	});
	const parsedRes = (await res.json() as PayloadResponse<Form>);
	if (parsedRes.totalDocs === 0) return null;

	const form = parsedRes.docs[0];

	return {
		name: form.name,
		description: form.description,
		isSubmissionForm: form.isSubmissionForm === 'true',
		status: form.status,
		skin: form.skin,
		form: form.form as unknown as IDefinition,
	};
}

export default async function FormPage({ params: { id, lang } }: IProps) {
	const form = await fetchForm(id, lang);

	if (!form) {
		notFound();
	}

	return (
		<div className="flex h-full min-h-screen flex-col bg-skin-background text-skin-text dark:bg-skin-background-dark dark:text-skin-text-dark">
			<div className="grow">
				<div className="my-16 flex w-full flex-col items-center px-4 md:px-16 lg:px-24 2xl:px-56">
					<div className="w-full max-w-full break-words px-4 md:break-normal">
						<FormRunner form={form} id={id} />
					</div>
				</div>
			</div>
		</div>
	);
}

export async function generateStaticParams({ params: { lang } }: IProps) {
	let forms: Form[] = [];
	let moreForms = true;
	let page = 1;

	async function fetchNextForms() {
		// Fetch next page
		const formsRes = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL!}/api/forms?depth=0&limit=100&page=${page}&depth=0&locale=${lang}&fallback-locale=en`, {
			headers: {
				'X-RateLimit-Bypass': process.env.PAYLOAD_BYPASS_RATE_LIMIT_KEY ?? undefined,
				Authorization: process.env.PAYLOAD_API_KEY ? `users API-Key ${process.env.PAYLOAD_API_KEY}` : undefined,
			} as Record<string, string>,
			next: {
				tags: ['projectList'],
			},
		});
		const body: PayloadResponse<Form> = await formsRes.json();

		forms = forms.concat(body.docs);

		// Set variables for next fetch
		page += 1;
		moreForms = body.hasNextPage;
	}

	while (moreForms) {
		// eslint-disable-next-line no-await-in-loop
		await fetchNextForms();
	}

	return forms.map((project) => (
		{
			id: project.id,
		}
	));
}

export async function generateMetadata({ params: { id, lang } }: IProps): Promise<Metadata> {
	const formsRes = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL!}/api/forms?where[id][equals]=${id}&depth=0&locale=${lang}&fallback-locale=en`, {
		headers: {
			'X-RateLimit-Bypass': process.env.PAYLOAD_BYPASS_RATE_LIMIT_KEY ?? undefined,
			Authorization: process.env.PAYLOAD_API_KEY ? `users API-Key ${process.env.PAYLOAD_API_KEY}` : undefined,
		} as Record<string, string>,
		next: {
			tags: [id],
		},
	});
	const parsedProjectRes = (await formsRes.json() as PayloadResponse<Form>);
	if (parsedProjectRes.totalDocs === 0) return notFound();

	const {
		name, description,
	} = parsedProjectRes.docs[0];

	return {
		title: name,
		description,
		alternates: {
			canonical: `/forms/${id}`,
			languages: {
				en: `/en/forms/${id}`,
				ja: `/jp/forms/${id}`,
			},
		},
		openGraph: {
			title: name,
			description,
			siteName: 'HoloEN Fan Website',
		},
		twitter: {
			title: name,
			description,
			site: '@HEF_Website',
			card: 'summary_large_image',
		},
		robots: 'noindex',
	};
}
