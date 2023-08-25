import { Submission as ISubmission, SubmissionMedia } from 'types/payload-types';
import ReactPlayerWrapper from 'components/ui/project/ReactPlayerWrapper';
import Image from 'components/ui/Image';
import useTranslation from 'lib/i18n/server';
import { Language } from 'lib/i18n/languages';
import SubmissionGallery from './SubmissionGallery';

interface IProps {
	submission: Omit<ISubmission, 'media' | 'srcIcon'> & { media: Array<Required<ISubmission>['media'][number] & { image: SubmissionMedia }>; srcIcon: SubmissionMedia };
	index?: number;
	lang: Language;
}

export default async function Submission({ submission, index, lang }: IProps) {
	const { t } = await useTranslation(lang, 'project', 'submission');

	return (
		<div className="w-full max-h-full text-black dark:text-white">
			<div className="w-full flex mt-4 h-14">
				{submission.srcIcon && (
					<Image
						className="object-cover w-14 h-14 rounded-full"
						src={submission.srcIcon.url!}
						width={
							submission.srcIcon.width! < 56 ? submission.srcIcon.width : 56
						}
						height={
							submission.srcIcon.width! < 56
								? submission.srcIcon.height!
								: (submission.srcIcon.height! / submission.srcIcon.width!) * 56
						}
						alt={`Profile picture of ${submission.author}`}
					/>
				)}
				{submission.author && (
					<div className="text-lg mt-3 ml-4">
						{t('author')}
						{submission.author}
					</div>
				)}
				<div className="flex-grow" />
				{index !== undefined && (
					<p className="text-xl mt-3 mr-4">{`#${index + 1}`}</p>
				)}
			</div>
			<div className="w-full mt-3">
				{
					submission.media.length === 1 && (
						<>
							{submission.media[0].type === 'video' && (
								<ReactPlayerWrapper
									width="100%"
									height="100%"
									url={submission.media[0].url!}
									controls
									light
									className="mb-4 mt-4"
								/>
							)}
							{submission.media[0].type === 'image' && (
								<div className="mt-4 mb-2 w-full h-full max-h-[750px] flex justify-center">
									<Image
										className="max-w-10/12 object-contain mb-4"
										src={submission.media[0].image.url!}
										width={
											submission.media[0].image.width! < 1024
												? submission.media[0].image.width : 1024
										}
										height={
											submission.media[0].image.width! < 1024
												? submission.media[0].image.height!
												// eslint-disable-next-line max-len
												: (submission.media[0].image.height! / submission.media[0].image.width!) * 1024
										}
										alt={`Image submission from ${submission.author}`}
									/>
								</div>
							)}
						</>
					)
				}
				{
					submission.media.length > 1 && (
						<SubmissionGallery
							submission={submission}
							elements={submission.media.map((media, submissionIndex) => {
								if (media.type === 'video') {
									return (
										<ReactPlayerWrapper
											width="100%"
											height="100%"
											key={media.id!}
											url={media.url!}
											controls
											light
										/>
									);
								}
								if (media.type === 'image') {
									return (
										<Image
											className="max-w-10/12 object-contain mb-4"
											key={media.id!}
											src={media.image.url!}
											width={
												media.image.width! < 1024 ? media.image.width : 1024
											}
											height={
												media.image.width! < 1024
													? media.image.height!
													: (media.image.height! / media.image.width!) * 1024
											}
											alt=""
											loading={submissionIndex > 0 ? 'eager' : 'lazy'}
										/>
									);
								}

								return <p key={media.id!}>{t('invalid-media')}</p>;
							})}
						/>
					)
				}
				{submission.message && (
					<p className="mx-4 mb-4 w-auto h-full overflow-auto whitespace-pre-line dark:text-gray-300">
						{submission.message}
					</p>
				)}
				<hr className="border-t-1 border-dashed border-gray-400" />
			</div>
		</div>
	);
}
