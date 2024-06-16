import useTranslation from '@/lib/i18n/client';
import { Contributor } from '../utils/types';

interface IProps {
	label: string;
	contributors: Contributor[];
}

interface RCProps {
	label: string;
	contributor: Contributor
}

function RenderedContributor({ label, contributor }: RCProps) {
	if (contributor.socials.length === 0) {
		return (
			<li>
				{contributor.name}
			</li>
		);
	}

	return (
		<li>
			{contributor.name}
			{' '}
			-
			{' '}
			{contributor.socials.map((social) => (
				<span
					key={`span-${label}-${contributor.name}-${social.platform}`}
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
	);
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
					<RenderedContributor
						key={`rc-${label}-${contributor.name}`}
						label={label}
						contributor={contributor}
					/>
				))}
			</ul>
		</div>
	);
}
