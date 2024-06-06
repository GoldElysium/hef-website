import { Contributor } from '../utils/types';

interface Props {
	label: string;
	contributors: Contributor[];
}

function CreditBlock({ label, contributors }: Props) {
	return (
		<div className="mb-4">
			<h3 className="mb-1 text-2xl font-semibold">
				{label}
				:
			</h3>
			<ul className="ml-4 list-inside list-disc">
				{contributors.map((contributor) => (
					<li key={`${label} ${contributor.name}`}>
						{contributor.name}
						{' '}
						-
						{' '}
						{contributor.socials.map((social) => (
							<span
								key={`${label} ${contributor.name} ${social.link}`}
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

export default CreditBlock;
