import { IPrologue, L10n } from '@tripetto/runner';
import { markdownifyToJSX, TRunnerViews } from '@tripetto/runner-react-hook';

interface IProps extends IPrologue {
	readonly l10n: L10n.Namespace;
	readonly view: TRunnerViews;
	readonly isPage: boolean;
	readonly start: () => void;
	readonly edit?: () => void;
}

// eslint-disable-next-line max-len
/* eslint-disable jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions */
export default function Prologue({
	title,
	description,
	image,
	l10n,
	edit,
	start,
	button,
	view,
	isPage,
}: IProps) {
	return (
		<div>
			{image && <img src={image} onClick={edit} alt="" />}
			{title && (
				<h2 onClick={edit}>
					{markdownifyToJSX(title)}
				</h2>
			)}
			{description && (
				<p onClick={edit}>
					{markdownifyToJSX(description)}
				</p>
			)}
			<button
				type="button"
				onClick={start}
				ref={(e) => {
					if (view === 'live' && isPage && e) {
						e.focus();
					}
				}}
			>
				{button || l10n.pgettext('runner#1|🆗 Buttons', 'Start')}
			</button>
		</div>
	);
}
