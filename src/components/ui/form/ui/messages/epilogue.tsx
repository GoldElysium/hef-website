import { IEpilogue, L10n, markdownifyToURL } from '@tripetto/runner';
import { markdownifyToJSX, TRunnerViews } from '@tripetto/runner-react-hook';
import ReactPlayer from 'react-player';

interface IProps extends IEpilogue {
	readonly l10n: L10n.Namespace;
	readonly view: TRunnerViews;
	readonly repeat?: () => void;
	// eslint-disable-next-line react/no-unused-prop-types
	readonly edit?: () => void;
}

export default function Epilogue({
	l10n,
	view,
	context,
	getRedirect,
	redirectUrl,
	repeat,
	image,
	title,
	description,
	video,
}: IProps) {
	if (view === 'live' && getRedirect && getRedirect()) {
		return null;
	}

	return (
		<div className="mb-8">
			{view !== 'live' && redirectUrl ? (
				<>
					<h2 className="text-xl text-skin-heading dark:text-skin-heading-dark">
						{view === 'preview'
							? l10n.pgettext('runner:classic', '🌍 Redirect preview')
							: l10n.pgettext('runner:classic', '🎉 Test completed')}

					</h2>
					<p>
						{l10n.pgettext('runner:classic', 'In a live environment the form will redirect to:')}
						<br />
						<a href={markdownifyToURL(redirectUrl, context) || '#'} target="_blank">
							{markdownifyToURL(redirectUrl, context)
								|| l10n.pgettext('runner:classic', 'The supplied URL is invalid!')}
						</a>
					</p>
					{view === 'test' && (
						<button
							type="button"
							disabled={!repeat}
							onClick={repeat}
						>
							{l10n.pgettext('runner:classic', 'Test again')}
						</button>
					)}
				</>
			) : (
				<>
					{image && <img src={image} alt="" />}
					<h2 className="mb-4 text-4xl font-bold text-skin-heading dark:text-skin-heading-dark">
						{markdownifyToJSX(
							title
								|| (view === 'test' && l10n.pgettext('runner:classic', '🎉 Test completed'))
								|| l10n.pgettext('runner#2|💬 Messages|Conversation ended', "🎉 It's a wrap!"),
							context,
						)}
					</h2>
					{description ? (
						<p className="text-lg">
							{markdownifyToJSX(description, context)}
						</p>
					) : (
						<p>
							{l10n.pgettext('runner:classic', 'Your response has been recorded. Thank you!')}
						</p>
					)}
					{video && <ReactPlayer src={markdownifyToURL(video)} />}
				</>
			)}
		</div>
	);
}
