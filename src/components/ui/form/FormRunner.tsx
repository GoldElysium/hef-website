'use client';

import { IRunnerAttachments, markdownifyToJSX, useRunner } from '@tripetto/runner-react-hook';
import type { IForm } from '@/app/[lang]/(DynamicLayout)/forms/[id]/page';
import { ReactNode } from 'react';
import {
	castToBoolean, markdownifyToString, markdownifyToURL, NodeBlock,
} from '@tripetto/runner';
import { TOverlayContext, useOverlay } from '@tripetto/runner-fabric/overlay';
import './blocks';

interface IProps {
	id: string;
	form: IForm;
}

export interface IFormNodeBlock extends NodeBlock {
	readonly required?: boolean;
	readonly marginAroundBlock?: boolean;
	readonly hideRequiredIndicatorFromName?: boolean;
	readonly render?: (props: IFormNodeBlockProps) => ReactNode;
}

export interface IFormNodeBlockProps {
	readonly id: string;
	readonly overlay: TOverlayContext;
	readonly name: JSX.Element | undefined;
	readonly description: JSX.Element | undefined;
	readonly explanation: JSX.Element | undefined;
	readonly label: JSX.Element | undefined;
	readonly placeholder: string;
	readonly tabIndex: number;
	readonly isFailed: boolean;
	readonly ariaDescribedBy: string | undefined;
	readonly ariaDescription: JSX.Element | undefined;
	readonly autoFocus: (element: HTMLElement | null) => void;
	readonly onSubmit: (() => void) | undefined;
	readonly focus: ((event: FocusEvent) => void) | undefined;
	readonly blur: ((event: FocusEvent) => void) | undefined;
	readonly attachments: IRunnerAttachments | undefined;
	readonly markdownifyToJSX: (md: string, lineBreaks?: boolean) => JSX.Element;
	readonly markdownifyToURL: (md: string) => string;
	readonly markdownifyToImage: (md: string) => string;
	readonly markdownifyToString: (md: string) => string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function FormRunner({ id, form }: IProps) {
	const {
		storyline,
		// snapshot,
	} = useRunner<IFormNodeBlock>({
		definition: form.form,
		// snapshot: JSON.parse(localStorage.getItem(`form-${id}`) || 'null') || undefined,
	}, {
		autoStart: true,
		mode: 'paginated',
	});

	const [OverlayProvider, overlay] = useOverlay();

	/* const localSnapshot = useRef({
		data: undefined as ISnapshot<any> | undefined,
		save: () => {
			if (localStorage) {
				const currentSnapshot = snapshot();
				if (currentSnapshot) {
					localStorage.setItem(`form-${id}`, JSON.stringify(currentSnapshot));
				} else {
					localStorage.removeItem(`form-${id}`);
				}
			}
		},
	});

	if (typeof window !== 'undefined' && localStorage) {
		localSnapshot.current.data = JSON.parse(localStorage.getItem(`form-${id}`) || 'null')
			|| undefined;
	}

	useEffect(() => {
		window.addEventListener('unload', localSnapshot.current.save);

		return () => {
			window.removeEventListener('unload', localSnapshot.current.save);
		};
	}, []); */

	return (
		storyline
		&& !storyline.isEmpty
		&& (
			<>
				{storyline.map((moment, page) => (
					// eslint-disable-next-line react/no-array-index-key
					<div key={`form-page-${page}`}>
						<h1 className="text-4xl font-bold">{moment.section.props.name}</h1>
						<div className="flex flex-col gap-4">
							{moment.nodes.map((node) => (
								node.block?.render
									? node.block.render({
										overlay,
										attachments: {
											async get(key) {
												const res = await fetch(`${process.env.NEXT_PUBLIC_CDN_URL}/form-submissions/tmp/${key}`);

												return res.blob();
											},
											async put(file) {
												const res = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/forms/upload`, {
													method: 'POST',
													body: JSON.stringify({
														fileExt: file.name.split('.').pop(),
													}),
													headers: {
														'Content-Type': 'application/json',
													},
												});

												const { fields, url, filename } = await res.json();
												const formData = new FormData();
												Object.entries(fields).forEach(([field, value]) => {
													formData.append(field, value as string);
												});
												formData.append('file', file);

												await fetch(url, {
													body: formData,
												});

												return filename;
											},
											async delete(key) {
												await fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/forms/upload`, {
													method: 'DELETE',
													body: JSON.stringify({
														key,
													}),
													headers: {
														'Content-Type': 'application/json',
													},
												});
											},
										},
										get id() {
											return node.block?.key() || '';
										},
										// eslint-disable-next-line react/no-unstable-nested-components
										get name() {
											return (
												(node.props.name && castToBoolean(node.props.nameVisible, true) && (
													<label
														className="text-lg font-bold"
														htmlFor={node.block?.key()}
														key={node.block?.key('label')}
													>
														{markdownifyToJSX(node.props.name, node.context)}
														{node.block?.required
															&& !node.block.hideRequiredIndicatorFromName && (
															<span
																className="relative top-[0.2rem] ml-1 text-2xl font-bold text-skin-primary"
															>
																*
															</span>
														)}
													</label>
												))
												|| undefined
											);
										},
										// eslint-disable-next-line react/no-unstable-nested-components
										get description() {
											return (
												(node.props.description && (
													<p
														key={node.block?.key('description')}
													>
														{markdownifyToJSX(node.props.description, node.context)}
													</p>
												))
												|| undefined
											);
										},
										get explanation() {
											return (
												(
													node.props.explanation
													&& markdownifyToJSX(node.props.explanation, node.context)
												) || undefined
											);
										},
										get placeholder() {
											return markdownifyToString(node.props.placeholder || '', node.context) || '';
										},
										get label() {
											return markdownifyToJSX(
												node.props.placeholder || node.props.name || '...',
												node.context,
												false,
											);
										},
										get tabIndex(): number {
											return 0;
										},
										get isFailed() {
											return false;
										},
										get ariaDescribedBy() {
											return (node.props.explanation && node.block?.key('explanation')) || undefined;
										},
										// eslint-disable-next-line react/no-unstable-nested-components
										get ariaDescription() {
											return (
												(node.props.explanation && (
													<p id={node.block?.key('explanation')}>
														{markdownifyToJSX(node.props.explanation, node.context)}
													</p>
												))
												|| undefined
											);
										},
										focus: () => {},
										blur: () => {},
										autoFocus: () => {},
										onSubmit: () => {},
										// eslint-disable-next-line max-len
										markdownifyToJSX: (md: string, lineBreaks?: boolean) => markdownifyToJSX(md, node.context, lineBreaks),
										markdownifyToURL: (md: string) => markdownifyToURL(md, node.context),
										// eslint-disable-next-line max-len
										markdownifyToImage: (md: string) => markdownifyToURL(md, node.context, undefined, [
											'image/jpeg',
											'image/png',
											'image/svg',
											'image/gif',
										]) || '',
										// eslint-disable-next-line max-len
										markdownifyToString: (md: string, lineBreaks?: boolean) => markdownifyToString(md, node.context, undefined, lineBreaks),
									})
									: (
										<div key={node.key}>
											{castToBoolean(node.props.nameVisible, true) && (
												<h3 className="text-xl font-bold">{markdownifyToJSX(node.props.name || '...', node.context)}</h3>
											)}
											{node.props.description && (
												<p className="text-lg">{markdownifyToJSX(node.props.description, node.context, true)}</p>
											)}
										</div>
									)
							))}
						</div>
						<nav className="mt-8 flex gap-4">
							<button
								type="button"
								className="rounded-md bg-skin-primary px-4 py-2 text-skin-primary-foreground disabled:bg-skin-secondary disabled:text-skin-secondary-foreground dark:bg-skin-primary-dark dark:text-skin-primary-foreground-dark disabled:dark:bg-skin-secondary-dark disabled:dark:text-skin-secondary-foreground-dark"
								disabled={storyline.isAtStart}
								onClick={() => storyline.stepBackward()}
							>
								Back
							</button>
							<button
								type="button"
								className="rounded-md bg-skin-primary px-4 py-2 text-skin-primary-foreground disabled:bg-skin-secondary disabled:text-skin-secondary-foreground dark:bg-skin-primary-dark dark:text-skin-primary-foreground-dark disabled:dark:bg-skin-secondary-dark disabled:dark:text-skin-secondary-foreground-dark"
								disabled={storyline.isFailed || (storyline.isAtFinish && !storyline.isFinishable)}
								onClick={() => storyline.stepForward()}
							>
								{storyline.isAtFinish ? 'Finish' : 'Next'}
							</button>
						</nav>
					</div>
				))}
				<OverlayProvider />
			</>
		)
	);
}
