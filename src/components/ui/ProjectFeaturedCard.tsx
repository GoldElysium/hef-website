import { Media, Project } from '@/types/payload-types';
import { getImageUrl } from '@/components/ui/legacy/Image';
import ButtonLink from '@/components/ui/ButtonLink';
import { Language } from '@/lib/i18n/languages';

interface IProps {
	project: Project;
	lang: Language;
}

export default function ProjectFeaturedCard({ project, lang }: IProps) {
	return (
		<div
			style={{
				backgroundImage: `url(${getImageUrl({
					src: (project.image as Media).url!,
					width: 800,
					quality: 75,
					action: 'resize',
				})})`,
			}}
			className="relative size-full rounded-lg border-b-4 border-skin-header bg-cover"
		>
			<div className="absolute bottom-0 z-10 w-full rounded-b-lg">
				<div className="relative">
					<div className="absolute bottom-0 -z-1 size-full bg-skin-header/50 text-white mix-blend-exclusion blur-md backdrop-blur-[12.5px]" />
					<div className="z-10 flex items-center justify-between gap-4 p-6">
						<span className="text-lg text-white">
							{project.title}
						</span>
						<ButtonLink text="View" url={`/projects/${project.slug}`} lang={lang} internal forceLightMode />
					</div>
				</div>
			</div>
		</div>
	);
}
