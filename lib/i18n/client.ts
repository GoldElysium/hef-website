'use client';

import { Namespace, KeyPrefix } from 'i18next';
import {
	useTranslation as useTranslationOrg,
	UseTranslationResponse,
} from 'react-i18next';

export default function useTranslation<
	N extends Namespace,
	TKPrefix extends KeyPrefix<N>,
>(namespace?: N, keyPrefix?: TKPrefix): UseTranslationResponse<N, TKPrefix> {
	return useTranslationOrg(namespace, { keyPrefix });
}
