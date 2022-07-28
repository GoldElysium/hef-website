// noinspection TypeScriptValidateTypes

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

	const dateStringOptions = {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
	};

	return (
		<div className="timeline">
			<ul>
				<li>
					<div>
						<time>{(new Date('2021-08-22T08:05:27Z')).toLocaleDateString(undefined, dateStringOptions)}</time>
						<a href="https://www.youtube.com/watch?v=qaEkfdFSxvs"
							target="_blank"
							rel="noreferrer noopener">Sana Landing</a>
					</div>
				</li>
				<li>
					<div>
						<time>{(new Date('2021-08-22T18:06:19Z')).toLocaleDateString(undefined, dateStringOptions)}</time>
						<a href="https://www.youtube.com/watch?v=3Tv5GyebhQo"
							target="_blank"
							rel="noreferrer noopener">【DEBUT STREAM】</a> Sana makes her debut! In which we learn about the BEEGest space baby.
					</div>
				</li>
				<li>
					<div>
						<time>{(new Date('2021-09-05T05:33:26Z')).toLocaleDateString(undefined, dateStringOptions)}</time>
						<a href="https://www.youtube.com/watch?v=I6YaBqHtkTU"
							target="_blank"
							rel="noreferrer noopener">【SUPARTY!】</a> Sana celebrates the opening of Super Chats on her channel and definitely does not buy enough party poppers.
					</div>
				</li>
				<li>
					<div>
						<time>{(new Date('2021-09-27T02:26:57Z')).toLocaleDateString(undefined, dateStringOptions)}</time>
						<a href="https://www.youtube.com/watch?v=v0p_T5nv-7Q"
							target="_blank"
							rel="noreferrer noopener">【Memberships Open!】</a> We birth a horse together with Sana.
					</div>
				</li>
				<li>
					<div>
						<time>October 13, 2021</time>
						Sana achieves 200,000 YouTube subscribers.
					</div>
				</li>
				<li>
					<div>
						<time>March 10, 2022</time>
						Sana achieves 300,000 YouTube subscribers.
					</div>
				</li>
				<li>
					<div>
						<time>July 12, 2022</time>
						Sana announces her graduation date of July 31st.
					</div>
				</li>
			</ul>
		</div>
	);
}

export default ProjectTimeline;
