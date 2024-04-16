import { Language } from '@/lib/i18n/languages';
import PayloadResponse from '@/types/PayloadResponse';
import { Form } from '@/types/payload-types';
import type { IDefinition } from '@tripetto/runner';
import type { IForm } from '@/app/[lang]/(DynamicLayout)/forms/[id]/page';

export default async function fetchForm(id: string, lang: Language): Promise<IForm | null> {
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
