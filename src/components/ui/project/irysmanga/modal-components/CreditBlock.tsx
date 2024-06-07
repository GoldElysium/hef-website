import { Contributor } from '../utils/types';

interface Props {
	label: string;
	contributors: Contributor[];
}
/* eslint-disable */
function CreditBlock({ label, contributors }: Props) {
    return (
        <div className="mb-4">
            <h3 className="mb-1 text-2xl font-semibold">{label}:</h3>
            <ul className="ml-4 list-inside list-disc">
                {contributors.map((contributor, index) => (
                    <li key={`${label} ${index}`}>
                        {contributor.name} -{" "}
                        {contributor.socials.map((social, indexx) => (
                            <span
                                key={`${label} ${contributor.name} ${indexx}`}
                            >
                                <a
                                    href={social.link}
                                    className="link"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {social.platform}
                                </a>{" "}
                            </span>
                        ))}
                    </li>
                ))}
            </ul>
        </div>
    );
}
/* eslint-enable */

export default CreditBlock;
