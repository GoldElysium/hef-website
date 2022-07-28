import { useEffect } from 'react';
import { IEvent } from '../../../models/Project';

export interface ProjectTimelineProps {
	events: IEvent[],
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function ProjectTimeline({ events }: ProjectTimelineProps) {
	useEffect(() => {
		// noinspection TypeScriptValidateTypes
		const items = document.querySelectorAll('.timeline li');

		// check if an element is in viewport
		// http://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport
		function isElementInViewport(el) {
			const rect = el.getBoundingClientRect();
			return (
				rect.top >= 0 &&
				rect.left >= 0 &&
				rect.bottom <=
				(window.innerHeight || document.documentElement.clientHeight) &&
				rect.right <= (window.innerWidth || document.documentElement.clientWidth)
			);
		}

		function callbackFunc() {
			console.log('got to here');
			for (let i = 0; i < items.length; i++) {
				if (isElementInViewport(items[i])) {
					items[i].classList.add('in-view');
				}
			}
		}

		// listen for events
		window.addEventListener('resize', callbackFunc);
		window.addEventListener('scroll', callbackFunc);
		callbackFunc();
	});

	return (
		<div className="timeline">
			<ul>
				<li>
					<div>
						<time>1934</time>
						At vero eos et accusamus et iusto odio dignissimos ducimus qui
						blanditiis praesentium At vero eos et accusamus et iusto odio
						dignissimos ducimus qui blanditiis praesentium
					</div>
				</li>
				<li>
					<div>
						<time>1937</time>
						Proin quam velit, efficitur vel neque vitae, rhoncus commodo mi.
						Suspendisse finibus mauris et bibendum molestie. Aenean ex augue, varius
						et pulvinar in, pretium non nisi.
					</div>
				</li>
				<li>
					<div>
						<time>1940</time>
						Proin iaculis, nibh eget efficitur varius, libero tellus porta dolor, at
						pulvinar tortor ex eget ligula. Integer eu dapibus arcu, sit amet
						sollicitudin eros.
					</div>
				</li>
				<li>
					<div>
						<time>1943</time>
						In mattis elit vitae odio posuere, nec maximus massa varius. Suspendisse
						varius volutpat mattis. Vestibulum id magna est.
					</div>
				</li>
				<li>
					<div>
						<time>1946</time>
						In mattis elit vitae odio posuere, nec maximus massa varius. Suspendisse
						varius volutpat mattis. Vestibulum id magna est.
					</div>
				</li>
				<li>
					<div>
						<time>1956</time>
						In mattis elit vitae odio posuere, nec maximus massa varius. Suspendisse
						varius volutpat mattis. Vestibulum id magna est.
					</div>
				</li>
				<li>
					<div>
						<time>1957</time>
						In mattis elit vitae odio posuere, nec maximus massa varius. Suspendisse
						varius volutpat mattis. Vestibulum id magna est.
					</div>
				</li>
				<li>
					<div>
						<time>1967</time>
						Aenean condimentum odio a bibendum rhoncus. Ut mauris felis, volutpat
						eget porta faucibus, euismod quis ante.
					</div>
				</li>
				<li>
					<div>
						<time>1977</time>
						Vestibulum porttitor lorem sed pharetra dignissim. Nulla maximus, dui a
						tristique iaculis, quam dolor convallis enim, non dignissim ligula ipsum
						a turpis.
					</div>
				</li>
				<li>
					<div>
						<time>1985</time>
						In mattis elit vitae odio posuere, nec maximus massa varius. Suspendisse
						varius volutpat mattis. Vestibulum id magna est.
					</div>
				</li>
				<li>
					<div>
						<time>2000</time>
						In mattis elit vitae odio posuere, nec maximus massa varius. Suspendisse
						varius volutpat mattis. Vestibulum id magna est.
					</div>
				</li>
				<li>
					<div>
						<time>2005</time>
						In mattis elit vitae odio posuere, nec maximus massa varius. Suspendisse
						varius volutpat mattis. Vestibulum id magna est.
					</div>
				</li>
			</ul>
		</div>
	);
}

export default ProjectTimeline;
