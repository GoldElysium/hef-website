// noinspection TypeScriptValidateTypes

import { useEffect } from 'react';
import { IEvent } from '../../../models/Project';

export interface ProjectTimelineProps {
	events: IEvent[],
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function ProjectTimeline({ events }: ProjectTimelineProps) {
	useEffect(() => {
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

		return () => {
			window.removeEventListener('resize', callbackFunc);
			window.removeEventListener('scroll', callbackFunc);
		};
	});

	const dateStringOptions = {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
	};

	// Timeline design from https://codepen.io/tutsplus/details/QNeJgR
	return (
		<div className="timeline">
			<ul>
				<li>
					<div>
						<time>{(new Date('2021-08-17T01:00:11Z')).toLocaleDateString(undefined, dateStringOptions)}</time>
						<a href="https://www.youtube.com/watch?v=SLnxCyzFgPw"
							target="_blank"
							rel="noreferrer noopener">The debut PV for Hololive Council is released</a> and Sana makes <a href="https://twitter.com/tsukumosana/status/1427436063832776714" target="_blank" rel="noreferrer noopener">her first tweet</a>.
					</div>
				</li>
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
							rel="noreferrer noopener">Sana makes her debut!</a> In which we learn about the BEEGest space baby, and Earth is destroyed for the first time.
					</div>
				</li>
				<li>
					<div>
						<time>{(new Date('2021-09-05T05:33:26Z')).toLocaleDateString(undefined, dateStringOptions)}</time>
						<a href="https://www.youtube.com/watch?v=I6YaBqHtkTU"
							target="_blank"
							rel="noreferrer noopener">Sana celebrates the opening of Super Chats</a> on her channel and definitely does not buy enough party poppers.
					</div>
				</li>
				<li>
					<div>
						<time>{(new Date('2021-09-27T02:26:57Z')).toLocaleDateString(undefined, dateStringOptions)}</time>
						<a href="https://www.youtube.com/watch?v=v0p_T5nv-7Q"
							target="_blank"
							rel="noreferrer noopener">Memberships open!</a> We birth a horse together with Sana.
					</div>
				</li>
				<li>
					<div>
						<time>{(new Date('2021-10-11T03:34:15Z')).toLocaleDateString(undefined, dateStringOptions)}</time>
						<a href="https://www.youtube.com/watch?v=SqXnQ8jSGBk"
							target="_blank"
							rel="noreferrer noopener">【Celeste B-sides】floor doko</a><br/>
						Chat breaks Sana and her manager by starting a <a href="https://www.youtube.com/watch?v=EKkaN5eoo3U" target="_blank" rel="noreferrer noopener">sorry SC train</a> (sorry!). Sana destroys Earth for a second time, and <a href="https://www.youtube.com/watch?v=8--Ppk2xkZw" target="_blank" rel="noreferrer noopener">Fauna has to fix it</a>.

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
						<time>{(new Date('2021-11-10T17:33:02Z')).toLocaleDateString(undefined, dateStringOptions)}</time>
						<a href="https://www.youtube.com/watch?v=5SvarR1zE74"
							target="_blank"
							rel="noreferrer noopener">【Sana Landing】Look! Up in the sky!</a><br/>
						Sana returns from a break and <a href="https://www.youtube.com/watch?v=wlywyCL03VA" target="_blank" rel="noreferrer noopener">accidentally destroys the Earth again</a> during her landing! Oops. Council comes together to fix it this time.

					</div>
				</li>
				<li>
					<div>
						<time>{(new Date('2021-11-15T01:26:47Z')).toLocaleDateString(undefined, dateStringOptions)}</time>
						<a href="https://www.youtube.com/watch?v=CV42ivUlyN0"
							target="_blank"
							rel="noreferrer noopener">【Evil God Korone】Oh I&apos;m die.</a><br/>
						Wait, there&apos;s a Sana cult now? No, but Korone did brainwash Sana and <a href="https://www.youtube.com/watch?v=BKfpZWSR29Q" target="_blank" rel="noreferrer noopener">convert her into a Koronesuki</a>. <em>Seno seno Korone ga seno! Kawaii Korone ga seno chu!</em>
					</div>
				</li>
				<li>
					<div>
						<time>November 19, 2021</time>
						Sana appears alongside Council at Anime NYC during a special panel.
					</div>
				</li>
				<li>
					<div>
						<time>{(new Date('2021-12-21T01:15:13Z')).toLocaleDateString(undefined, dateStringOptions)}</time>
						<a href="https://www.youtube.com/watch?v=kPyLnwSXqkA"
							target="_blank"
							rel="noreferrer noopener">The Twelve Days of Christmas - hololive English Cover</a><br/>
						Sana participates in her first official cover song, a rendition of The Twelve Days of Christmas.<br/>
					</div>
				</li>
				<li>
					<div>
						<time>{(new Date('2021-12-21T01:15:13Z')).toLocaleDateString(undefined, dateStringOptions)}</time>
						<a href="https://www.youtube.com/watch?v=oViEFu_ftXg"
							target="_blank"
							rel="noreferrer noopener">【NEW OUTFIT REVEAL】KIMONOut of this world</a><br/>
						Sana unveils her first new Live2D outfit, a kimono to celebrate the new year! <strike>It comes with a Neighbula mask that Sana can wear</strike> Neighbula also makes his Live2D debut.
					</div>
				</li>
				<li>
					<div>
						<time>{(new Date('2022-01-01T10:02:37Z')).toLocaleDateString(undefined, dateStringOptions)}</time>
						Sana rings in the New Year with <a href="https://www.youtube.com/watch?v=8xFvwcI9jOg" target="_blank" rel="noreferrer noopener">a 14-hour Animal Crossing stream</a> <a href="https://www.youtube.com/watch?v=2ug7ZmRuwws" target="_blank" rel="noreferrer noopener">in 2 parts</a>. She catches ALL THE FISH. Some lucky Sanallites also visit her island to celebrate together!
					</div>
				</li>
				<li>
					<div>
						<time>{(new Date('2022-01-03T02:55:02Z')).toLocaleDateString(undefined, dateStringOptions)}</time>
						After 738 resets (a 14% chance), <a href="https://www.youtube.com/watch?v=tyC9A2tuf28"
							target="_blank"
							rel="noreferrer noopener">Sana catches a shiny Rayquaza</a>! On the first try. With a luxury ball. BEEG luck! She also completed her Pokedex this stream.
					</div>
				</li>
				<li>
					<div>
						<time>{(new Date('2022-02-14T23:10:57Z')).toLocaleDateString(undefined, dateStringOptions)}</time>
						<a href="https://www.youtube.com/watch?v=MIN-lwixweI"
							target="_blank"
							rel="noreferrer noopener">V-v-valentines cards?!</a><br/>
						The Sanallites surprised Sana with many cards for Valentine&apos;s Day! She becomes a potato.
					</div>
				</li>
				<li>
					<div>
						<time>{(new Date('2022-02-14T23:10:57Z')).toLocaleDateString(undefined, dateStringOptions)}</time>
						<a href="https://www.youtube.com/watch?v=P_GbsqSjgt8" target="_blank" rel="noreferrer noopener">HoloCouncil celebrates their 6-month anniversary!</a> They also release a cover of <a href="https://www.youtube.com/watch?v=U-9M-BjFYMc" target="_blank" rel="noreferrer noopener"><em>Hikaru Nara</em></a> after the stream, marking Sana&apos;s second official song cover.
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
						<time>{(new Date('2022-06-11T03:00:15Z')).toLocaleDateString(undefined, dateStringOptions)}</time>
						Sana releases her first original song <a href="https://www.youtube.com/watch?v=R8y1aWMlPOs"
							target="_blank"
							rel="noreferrer noopener"><em>Astrogirl</em></a>.
					</div>
				</li>
				<li>
					<div>
						<time>{(new Date('2022-07-05T04:51:54Z')).toLocaleDateString(undefined, dateStringOptions)}</time>
						Sana helps IRyS design <a href="https://www.youtube.com/watch?v=WjYCPf3shKI" target="_blank" rel="noreferrer noopener">an official mascot</a>... or a pair of mascots. Welcome to the family, Bloom and Gloom!
					</div>
				</li>
				<li>
					<div>
						<time>{(new Date('2022-07-11T23:34:12Z')).toLocaleDateString(undefined, dateStringOptions)}</time>
						Sana <a href="https://www.youtube.com/watch?v=UbqJ7JObVBM" target="_blank" rel="noreferrer noopener">announces</a> she will be graduating from Hololive on July 31st, scheduling a large number of collabs prior to her retirement, along with teasing a special Council collab stream.
					</div>
				</li>
				<li>
					<div>
						<time>July 16–17, 2022</time>
						Sana appears at Smash Con 2022 along with Bae, doing two panels as well as a meet-and-greet with lucky fans.
					</div>
				</li>
				<li>
					<div>
						<time>{(new Date('2022-07-21T01:27:24Z')).toLocaleDateString(undefined, dateStringOptions)}</time>
						HoloCouncil debuts their BEEGsmol 3D models (designed by Sana herself), in <a href="https://www.youtube.com/watch?v=bFjuKhG2Hzc" target="_blank" rel="noreferrer noopener">a pseudo-anniversary celebration stream</a>.
					</div>
				</li>
			</ul>
		</div>
	);
}

export default ProjectTimeline;
