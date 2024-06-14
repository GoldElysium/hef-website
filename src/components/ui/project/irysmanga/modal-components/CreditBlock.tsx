import useTranslation from '@/lib/i18n/client';
import { Contributor } from '../utils/types';

interface IProps {
	label: string;
	contributors: Contributor[];
}

export default function CreditBlock({ label, contributors }: IProps) {
	const { t } = useTranslation('reader', 'modal-general');

	return (
		<div className="mb-4">
			<h3 className="mb-1 text-2xl font-semibold">
				{t(label)}
				:
			</h3>
			<ul className="ml-4 list-inside list-disc">
				{contributors.map((contributor) => (
					<li key={`li-${label}-${contributor.name}`}>
						{contributor.name}
						{' '}
						-
						{' '}
						{contributor.socials.map((social) => (
							<span
								key={`span-${label}-${contributor.name}`}
							>
								<a
									href={social.link}
									className="link"
									target="_blank"
									rel="noopener noreferrer"
								>
									{social.platform}
								</a>
								{' '}
							</span>
						))}
					</li>
				))}
			</ul>
		</div>
	);
}
