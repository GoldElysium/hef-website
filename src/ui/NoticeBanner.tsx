'use client';

import { Fragment, Suspense, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import useSWR, { Fetcher } from 'swr';
import { Notice as APINoticeBanner } from 'types/payload-types';
import DescriptionSerializer from 'ui/DescriptionSerializer';
import { useLocale } from 'contexts/LocaleContext';
import useTranslation from 'lib/i18n/client';
import { Language } from 'lib/i18n/languages';

/* TODO: fetch locale */
const fetcher: Fetcher<APINoticeBanner> = (lang: string) => fetch(`${process.env.NEXT_PUBLIC_CMS_URL!}/api/globals/notice?locale=${lang}`).then((res) => res.json());

function useNoticeBanner(lang: Language) {
	// eslint-disable-next-line max-len
	const { data, error } = useSWR<APINoticeBanner>([lang], fetcher, { refreshInterval: 10 * 60 * 1000 });
	return {
		data,
		isLoading: !error && !data,
		isError: error,
	};
}

export default function NoticeBanner() {
	const { locale } = useLocale();
	const { t } = useTranslation('layout', 'notice-banner');
	const { data, isError, isLoading } = useNoticeBanner(locale);
	const [dialogOpen, setDialogOpen] = useState(false);

	// eslint-disable-next-line max-len
	if (isLoading || isError || !data || !data.enabled || !data.message || !data.description) return null;

	return (
		<div>
			<div
				className="h-16 min-w-screen max-w-screen overflow-none flex justify-center items-center gap-4 bg-[#FFE5DA] py-2 px-2"
			>
				<span className="text-[#323232] md:text-lg font-semibold">
					{data.description}
				</span>
				<button
					type="button"
					className="px-4 py-2 bg-[#EF4444] hover:bg-red-400 text-white rounded-full md:text-lg"
					onClick={() => setDialogOpen(true)}
				>
					{t('open')}
				</button>
			</div>

			<Suspense fallback={null}>
				<Transition show={dialogOpen} as={Fragment}>
					<Dialog as="div" className="relative z-10" onClose={() => setDialogOpen(false)}>
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0"
							enterTo="opacity-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100"
							leaveTo="opacity-0"
						>
							<div className="fixed inset-0 bg-black bg-opacity-60" />
						</Transition.Child>

						<div className="fixed inset-0 overflow-y-auto">
							<div className="flex min-h-full items-center justify-center p-4 text-center">
								<Transition.Child
									as={Fragment}
									enter="ease-out duration-300"
									enterFrom="opacity-0 scale-95"
									enterTo="opacity-100 scale-100"
									leave="ease-in duration-200"
									leaveFrom="opacity-100 scale-100"
									leaveTo="opacity-0 scale-95"
								>
									<Dialog.Panel
										className="w-full max-w-4xl transform overflow-hidden rounded-2xl p-6 text-left align-middle shadow-xl transition-all bg-white dark:bg-skin-dark-background-2"
									>
										<Dialog.Title
											as="h3"
											className="text-lg md:text-2xl font-semibold leading-6 text-black dark:text-white"
										>
											{data.description}
										</Dialog.Title>
										<div className="mt-4">
											<p className="md:text-lg text-[#323232]">
												{DescriptionSerializer(data.message)}
											</p>
										</div>

										<div className="mt-6">
											<button
												type="button"
												className="inline-flex justify-center rounded-full border border-transparent bg-[#EF4444] hover:bg-red-400 text-white px-4 py-2 font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
												onClick={() => setDialogOpen(false)}
											>
												{t('close')}
											</button>
										</div>
									</Dialog.Panel>
								</Transition.Child>
							</div>
						</div>
					</Dialog>
				</Transition>
			</Suspense>
		</div>
	);
}
