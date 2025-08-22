import Image from '@/components/ui/legacy/Image';
import { ArrowTopRightOnSquareIcon, LinkIcon } from '@heroicons/react/20/solid';
import ReactPlayerWrapper from '@/components/ui/project/util/ReactPlayerWrapper';
import SubmissionGallery from '@/components/ui/project/SubmissionGallery';
import { Submission as ISubmission, SubmissionMedia } from '@/types/payload-types';

interface IProps {
	submission: Omit<ISubmission, 'media' | 'srcIcon'> & {
		media: Array<NonNullable<Required<ISubmission>['media']>[number] & { image: SubmissionMedia }>;
		srcIcon: SubmissionMedia
	};
	className?: string;
}

export default function Submission({ submission, className }: IProps) {
	return (
		<div
			id={submission.id}
			className={`rounded-md bg-skin-secondary px-8 py-4 dark:bg-skin-secondary-dark text-skin-secondary-foreground dark:text-skin-secondary-foreground-dark ${className}`}
		>
			<div className="flex">
				{submission.srcIcon && (
					<Image
						className="size-14 rounded-full object-cover"
						src={submission.srcIcon.url!}
						width={submission.srcIcon.width! < 56 ? submission.srcIcon.width! : 56}
						// eslint-disable-next-line max-len
						height={submission.srcIcon.width! < 56 ? submission.srcIcon.height! : (submission.srcIcon.height! / submission.srcIcon.width!) * 56}
						alt={`Profile picture of ${submission.author}`}
					/>
				)}
				<h3 className="font-bold">{submission.author}</h3>

				<div className="grow" />
				<a
					className="flex items-center gap-2"
					href={`#${submission.id}`}
				>
					<LinkIcon width={16} height={16} />
					Link
				</a>
			</div>
			{submission.media.length === 1 && (
				<>
					{submission.media[0].type === 'video' && (
						<ReactPlayerWrapper
							width="100%"
							height="100%"
							url={submission.media[0].url!}
							controls
							light
							className="my-4"
						/>
					)}
					{submission.media[0].type === 'image' && (
						<div className="mb-2 my-6 flex justify-center">
							<div className="flex flex-col items-center max-w-10/12">
								<div className="flex justify-center">
									<div>
										<Image
											className="size-fit mb-2 max-h-[750px] object-contain"
											src={submission.media[0].image.url!}
											/* eslint-disable max-len */
											width={submission.media[0].image.width! < 1024 ? submission.media[0].image.width! : 1024}
											height={submission.media[0].image.width! < 1024 ? submission.media[0].image.height!
												: (submission.media[0].image.height! / submission.media[0].image.width!) * 1024}
											/* eslint-enable */
											alt={`Image submission from ${submission.author}`}
										/>
										<div className="flex justify-end">
											<a href={submission.media[0].image.url!} target="_blank" rel="noopener noreferrer" className="text-sm flex items-center gap-2">
												<ArrowTopRightOnSquareIcon className="size-4" />
												Open original
											</a>
										</div>
									</div>
								</div>
							</div>
						</div>
					)}
				</>
			)}
			{submission.media.length > 1 && (
				<SubmissionGallery
					submission={submission}
					elements={submission.media!.map((media, submissionIndex) => {
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
							if (!media.image.url) {
								return <p key={media.id!}>Invalid media</p>;
							}

							return (
								<Image
									className="mb-4 max-w-10/12 object-contain"
									key={media.id!}
									src={media.image.url!}
									width={media.image.width! < 1024 ? media.image.width! : 1024}
									// eslint-disable-next-line max-len
									height={media.image.width! < 1024 ? media.image.height! : (media.image.height! / media.image.width!) * 1024}
									alt=""
									loading={submissionIndex > 0 ? 'eager' : 'lazy'}
								/>
							);
						}

						return <p key={media.id!}>Invalid media</p>;
					})}
				/>
			)}
			{submission.message && (
				<p className="mx-4 mb-4 h-full w-auto overflow-auto whitespace-pre-line">
					{submission.message}
				</p>
			)}
		</div>
	);
}
