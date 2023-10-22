import 'server-only';
import { Language } from '@/lib/i18n/languages';
import { Notice as APINoticeBanner } from '@/types/payload-types';
import NoticeBanner from '@/components/ui/NoticeBanner';

async function fetchNotice(lang: Language): Promise<APINoticeBanner> {
	const res = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL!}/api/globals/notice?locale=${lang}`, {
		headers: {
			'X-RateLimit-Bypass': process.env.PAYLOAD_BYPASS_RATE_LIMIT_KEY ?? undefined,
			Authorization: process.env.PAYLOAD_API_KEY ? `users API-Key ${process.env.PAYLOAD_API_KEY}` : undefined,
		} as Record<string, string>,
		next: {
			tags: ['notice'],
		},
	});
	return res.json();
}

export default async function NoticeBannerWrapper({ lang }: { lang: Language }) {
	const noticeData = await fetchNotice(lang);

	if (!noticeData.enabled) {
		return null;
	}

	return (
		<NoticeBanner data={noticeData} />
	);
}
