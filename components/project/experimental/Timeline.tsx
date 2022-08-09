// noinspection TypeScriptValidateTypes
/* eslint-disable max-len */

import { ReactNode, useEffect } from 'react';

function Link({ href, children }: { href: string, children?: ReactNode }) {
	return <a href={href}>{children}</a>;
}

export default function ProjectTimeline() {
	useEffect(() => {
		const items = document.querySelectorAll('.timeline li');

		// check if an element is in viewport
		// http://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport
		// (modified to show the element a bit earlier as the original waits for the whole invisible
		// element to be in the viewport first)
		function isElementInViewport(el: any) {
			const rect = el.getBoundingClientRect();
			return (
				rect.top >= 0
				&& rect.left >= 0
				&& rect.bottom
				<= ((window.innerHeight || document.documentElement.clientHeight) - (rect.top - rect.bottom) - 125)
				&& rect.right <= (window.innerWidth || document.documentElement.clientWidth)
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

	const dateStringOptions: any = {
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
						<time dateTime="2021-08-17T01:00:11Z">{(new Date('2021-08-17T01:00:11Z')).toLocaleDateString(undefined, dateStringOptions)}</time>
						<Link href="https://www.youtube.com/watch?v=SLnxCyzFgPw">The debut PV for Hololive Council is released</Link> and Sana makes <Link href="https://twitter.com/tsukumosana/status/1427436063832776714">her first tweet</Link>.
					</div>
				</li>
				<li>
					<div>
						<time dateTime="2021-08-22T08:05:27Z">{(new Date('2021-08-22T08:05:27Z')).toLocaleDateString(undefined, dateStringOptions)}</time>
						<Link href="https://www.youtube.com/watch?v=qaEkfdFSxvs">Sana Landing</Link>
					</div>
				</li>
				<li>
					<div>
						<time dateTime="2021-08-22T17:02:23Z">{(new Date('2021-08-22T17:02:23Z')).toLocaleDateString(undefined, dateStringOptions)}</time>
						<Link href="https://www.youtube.com/watch?v=3Tv5GyebhQo">Sana makes her debut!</Link> In which we learn about the BEEGest space baby, and Earth is destroyed for the first time.
					</div>
				</li>
				<li>
					<div>
						<time dateTime="2021-09-05T04:00:36Z">{(new Date('2021-09-05T04:00:36Z')).toLocaleDateString(undefined, dateStringOptions)}</time>
						<Link href="https://www.youtube.com/watch?v=I6YaBqHtkTU">Sana celebrates the opening of Super Chats</Link> on her channel and definitely does not buy enough party poppers.
					</div>
				</li>
				<li>
					<div>
						<time dateTime="2021-09-22T22:00:09Z">{(new Date('2021-09-22T22:00:09Z')).toLocaleDateString(undefined, dateStringOptions)}</time>
						<Link href="https://www.youtube.com/watch?v=jG0GKIXFdHw">1 month together with Sana!</Link> She surprises her fans with a beautiful piece of art to celebrate. She also mentions a possible horse-birthing stream in the future, and doesn&apos;t elaborate further.
					</div>
				</li>
				<li>
					<div>
						<time dateTime="2021-09-25T22:00:16Z">{(new Date('2021-09-25T22:00:16Z')).toLocaleDateString(undefined, dateStringOptions)}</time>
						Kicked off by <Link href="https://www.youtube.com/watch?v=t2n90NUzncQ">an ominous teaser</Link> a few days ago, <Link href="https://www.youtube.com/watch?v=s4M7quMcnnI">Inasanaty have their first collab</Link>, in which we learned that Ina and Sana are old friends.
					</div>
				</li>
				<li>
					<div>
						<time dateTime="2021-09-26T23:59:46Z">{(new Date('2021-09-26T23:59:46Z')).toLocaleDateString(undefined, dateStringOptions)}</time>
						<Link href="https://www.youtube.com/watch?v=v0p_T5nv-7Q">Memberships open!</Link> We birth a horse together with Sana.
					</div>
				</li>
				<li>
					<div>
						<time dateTime="2021-10-11T01:00:04Z">{(new Date('2021-10-11T01:00:04Z')).toLocaleDateString(undefined, dateStringOptions)}</time>
						<Link href="https://www.youtube.com/watch?v=SqXnQ8jSGBk">【Celeste B-sides】floor doko</Link><br/>
						Chat breaks Sana and her manager by starting a <Link href="https://www.youtube.com/watch?v=EKkaN5eoo3U">sorry SC train</Link> (sorry!). Sana destroys Earth for a second time, and <Link href="https://www.youtube.com/watch?v=8--Ppk2xkZw">Fauna has to fix it</Link>.
					</div>
				</li>
				<li>
					<div>
						<time dateTime="2021-10-13T02:05:45Z">{(new Date('2021-10-13T02:05:45Z')).toLocaleDateString(undefined, dateStringOptions)}</time>
						Sana achieves 200,000 YouTube subscribers.
					</div>
				</li>
				<li>
					<div>
						<time dateTime="2021-11-06T04:00:32Z">{(new Date('2021-11-06T04:00:32Z')).toLocaleDateString(undefined, dateStringOptions)}</time>
						Sana participates in the <Link href="https://www.youtube.com/watch?v=D6T6_UIJoc0">2021 Hololive Sports Festival</Link> in White C Team.
					</div>
				</li>
				<li>
					<div>
						<time dateTime="2021-11-10T16:03:26Z">{(new Date('2021-11-10T16:03:26Z')).toLocaleDateString(undefined, dateStringOptions)}</time>
						<Link href="https://www.youtube.com/watch?v=5SvarR1zE74">【Sana Landing】Look! Up in the sky!</Link><br/>
						Sana officially returns from her break and <Link href="https://www.youtube.com/watch?v=wlywyCL03VA">accidentally destroys the Earth again</Link> during her landing! Oops. Council comes together again to fix it this time.<br/>
						Elsewhere, <Link href="https://www.youtube.com/watch?v=Fln9XkzqcqI">Yagoo reads Sana&apos;s demand</Link> on behalf of the Sanallites to give birth to Neighbula.
					</div>
				</li>
				<li>
					<div>
						<time dateTime="2021-11-14T23:59:52Z">{(new Date('2021-11-14T23:59:52Z')).toLocaleDateString(undefined, dateStringOptions)}</time>
						<Link href="https://www.youtube.com/watch?v=CV42ivUlyN0">【Evil God Korone】Oh I&apos;m die.</Link><br/>
						Wait, there&apos;s a Sana cult now? No, but Korone did brainwash Sana and <Link href="https://www.youtube.com/watch?v=BKfpZWSR29Q">convert her into a Koronesuki</Link>. <em>Seno seno Korone ga seno! Kawaii Korone ga seno chu!</em> Papa pako <Link href="https://twitter.com/pakosun/status/1460047796417953797">draws a Yatagarasuki</Link> (Sanasuki?) that Sanallites immediately adopt as a profile picture en-masse. Definitely not a cult though.
					</div>
				</li>
				<li>
					<div>
						<time dateTime="2021-11-19T14:30:00-0500">{(new Date('2021-11-19T14:30:00-0500')).toLocaleDateString(undefined, dateStringOptions)}</time>
						Sana appears alongside Council at Anime NYC during a special panel.
					</div>
				</li>
				<li>
					<div>
						<time dateTime="2021-12-20T22:59:33Z">{(new Date('2021-12-20T22:59:33Z')).toLocaleDateString(undefined, dateStringOptions)}</time>
						<Link href="https://www.youtube.com/watch?v=ejuKoCAKs_Q">HoloEN celebrates Christmas together</Link> in VRChat! Through Sana&apos;s camera work, we see Myth, Council and IRyS share some heartwarming moments together.
					</div>
				</li>
				<li>
					<div>
						<time dateTime="2021-12-21T01:15:13Z">{(new Date('2021-12-21T01:15:13Z')).toLocaleDateString(undefined, dateStringOptions)}</time>
						<Link href="https://www.youtube.com/watch?v=kPyLnwSXqkA">The Twelve Days of Christmas - hololive English Cover</Link><br/>
						Sana participates in her first official cover song, a rendition of <em>The Twelve Days of Christmas</em>.<br/>
					</div>
				</li>
				<li>
					<div>
						<time dateTime="2021-12-21T03:00:24Z">{(new Date('2021-12-21T03:00:24Z')).toLocaleDateString(undefined, dateStringOptions)}</time>
						Sana embarks on her quest <Link href="https://www.youtube.com/watch?v=2S6sImgYqQc">to catch a shiny Rayquaza</Link>! Calli <Link href="https://www.youtube.com/watch?v=fzS16Ln8ANQ">joins her</Link> shortly after, trying to catch her own shiny Giratina. This would mark the longest collab in the history of Hololive at the time, at over 9 hours of playing together.
					</div>
				</li>
				<li>
					<div>
						<time dateTime="2021-12-31T21:24:17Z">{(new Date('2021-12-31T21:24:17Z')).toLocaleDateString(undefined, dateStringOptions)}</time>
						Sana rings in the New Year with <Link href="https://www.youtube.com/watch?v=8xFvwcI9jOg">a 14-hour Animal Crossing stream</Link> <Link href="https://www.youtube.com/watch?v=2ug7ZmRuwws">in 2 parts</Link>. She catches ALL THE FISH. Some lucky Sanallites also visit her island to celebrate together!
					</div>
				</li>
				<li>
					<div>
						<time dateTime="2022-01-02T21:01:20Z">{(new Date('2022-01-02T21:01:20Z')).toLocaleDateString(undefined, dateStringOptions)}</time>
						After 738 resets (a 14% chance), <Link href="https://www.youtube.com/watch?v=tyC9A2tuf28">Sana catches a shiny Rayquaza</Link>! On the first try. With a luxury ball. BEEG luck! She also completed her Pokedex this stream.
					</div>
				</li>
				<li>
					<div>
						<time dateTime="2022-01-07T04:02:02Z">{(new Date('2022-01-07T04:02:02Z')).toLocaleDateString(undefined, dateStringOptions)}</time>
						Sana participates in the <Link href="https://www.youtube.com/watch?v=U_IW6CyYn1k">2022 New Year&apos;s Mario Kart Tournament</Link> as part of C block. She gives it a valiant effort, but at 4th place behind Kronii, she is just 1 spot away from qualifying for the Winner&apos;s Cup.
					</div>
				</li>
				<li>
					<div>
						<time dateTime="2022-01-10T05:13:02Z">{(new Date('2022-01-10T05:13:02Z')).toLocaleDateString(undefined, dateStringOptions)}</time>
						Sana does a members-only drawing stream, and Sanallites officially become bread dogs.
					</div>
				</li>
				<li>
					<div>
						<time dateTime="2022-01-15T20:59:55Z">{(new Date('2022-01-15T20:59:55Z')).toLocaleDateString(undefined, dateStringOptions)}</time>
						<Link href="https://www.youtube.com/watch?v=oViEFu_ftXg">【NEW OUTFIT REVEAL】KIMONOut of this world</Link><br/>
						Sana unveils her first new Live2D outfit, a kimono to celebrate the new year! <s>It comes with a Neighbula mask that Sana can wear</s> Neighbula also makes his Live2D debut.
					</div>
				</li>
				<li>
					<div>
						<time dateTime="2022-01-25T23:15:20Z">{(new Date('2022-01-25T23:15:20Z')).toLocaleDateString(undefined, dateStringOptions)}</time>
						<Link href="https://www.youtube.com/watch?v=OgEsyuN8oKY">HoloMinistry makes their debut</Link> (and speedruns the fastest graduation). We meet Tsukumo San. He may look boyish, but just don&apos;t call him small...
					</div>
				</li>
				<li>
					<div>
						<time dateTime="2022-01-27T02:20:27Z">{(new Date('2022-01-27T02:20:27Z')).toLocaleDateString(undefined, dateStringOptions)}</time>
						Sana participates in <Link href="https://www.youtube.com/watch?v=KNZi4VYhbRE">the HoloENxID Pokemon tournament</Link>, achieving decisive victories with her signature Togekiss and becoming the champion. Did you expect any less?
					</div>
				</li>
				<li>
					<div>
						<time dateTime="2022-02-14T21:30:23Z">{(new Date('2022-02-14T21:30:23Z')).toLocaleDateString(undefined, dateStringOptions)}</time>
						<Link href="https://www.youtube.com/watch?v=MIN-lwixweI">V-v-valentines cards?!</Link><br/>
						The Sanallites surprised Sana with many cards for Valentine&apos;s Day! She becomes a potato.
					</div>
				</li>
				<li>
					<div>
						<time dateTime="2022-02-23T03:32:01Z">{(new Date('2022-02-23T03:32:01Z')).toLocaleDateString(undefined, dateStringOptions)}</time>
						<Link href="https://www.youtube.com/watch?v=P_GbsqSjgt8">HoloCouncil celebrates their 6-month anniversary!</Link> They also release a cover of <Link href="https://www.youtube.com/watch?v=U-9M-BjFYMc"><em>Hikaru Nara</em></Link> after the stream, marking Sana&apos;s second official song cover.
					</div>
				</li>
				<li>
					<div>
						<time dateTime="2022-03-10T14:32:01Z">{(new Date('2022-03-10T14:32:01Z')).toLocaleDateString(undefined, dateStringOptions)}</time>
						Sana achieves 300,000 YouTube subscribers.
					</div>
				</li>
				<li>
					<div>
						<time dateTime="2022-04-01T01:31:25Z">{(new Date('2022-04-01T01:31:25Z')).toLocaleDateString(undefined, dateStringOptions)}</time>
						It&apos;s April Fools&apos; Day (somewhere in the world), and Sana <Link href="https://www.youtube.com/watch?v=Yv2_XjybbXc">is not quite herself</Link>. Meanwhile, Fauna <Link href="https://www.youtube.com/watch?v=1gBvxOgGDCc">sounds a little familiar</Link>...
					</div>
				</li>
				<li>
					<div>
						<time dateTime="2022-06-10T23:00:31Z">{(new Date('2022-06-10T23:00:31Z')).toLocaleDateString(undefined, dateStringOptions)}</time>
						Sana <Link href="https://www.youtube.com/watch?v=BnW8BrppGr8">celebrates her birthday</Link>! With call-ins aplenty and the unveil of her birthday merch (including an incredibly face-plantable bread dog plushie), it&apos;s a good time all around.<br/>
						Sanallites also send her all their love, with Sana <Link href="https://www.youtube.com/watch?v=BnW8BrppGr8&t=11710s">tearing up over <em>Sana&apos;s Space Birthday Project</em></Link> and <Link href="https://www.youtube.com/watch?v=BnW8BrppGr8&t=12227s">showing off the <em>BEEG SANA</em> fangame</Link>.
					</div>
				</li>
				<li>
					<div>
						<time dateTime="2022-06-11T03:00:15Z">{(new Date('2022-06-11T03:00:15Z')).toLocaleDateString(undefined, dateStringOptions)}</time>
						Sana releases her first original song <Link href="https://www.youtube.com/watch?v=R8y1aWMlPOs"><em>Astrogirl</em></Link>. She&apos;s not alone!
					</div>
				</li>
				<li>
					<div>
						<time dateTime="2022-06-17T01:20:59Z">{(new Date('2022-06-17T01:20:59Z')).toLocaleDateString(undefined, dateStringOptions)}</time>
						Sana tackles Metroid Dread again, but this time she brings with her <Link href="https://www.youtube.com/watch?v=-tToGs-jm70">an army of bread dogs</Link> submitted by Sanallites on Twitter!
					</div>
				</li>
				<li>
					<div>
						<time dateTime="2022-07-05T03:02:03Z">{(new Date('2022-07-05T03:02:03Z')).toLocaleDateString(undefined, dateStringOptions)}</time>
						Sana helps IRyS design <Link href="https://www.youtube.com/watch?v=WjYCPf3shKI">an official mascot</Link>... or a pair of mascots. Welcome to the family, Bloom and Gloom!
					</div>
				</li>
				<li>
					<div>
						<time dateTime="2022-07-07T23:00:23Z">{(new Date('2022-07-07T23:00:23Z')).toLocaleDateString(undefined, dateStringOptions)}</time>
						The final Inasanaty collab, where <Link href="https://www.youtube.com/watch?v=cObkYo5zMvI">Sana and Ina celebrate Tanabata together.</Link><br/>
						They read out wishes sent in by fans, hanging them on virtual bamboo trees. In the end, they read their own wishes too. Sana&apos;s wish is that all the talents and the fans can find happiness!
					</div>
				</li>
				<li>
					<div>
						<time dateTime="2022-07-11T23:00:15Z">{(new Date('2022-07-11T23:00:15Z')).toLocaleDateString(undefined, dateStringOptions)}</time>
						Sana <Link href="https://www.youtube.com/watch?v=UbqJ7JObVBM">announces</Link> she will be graduating from Hololive on July 31st, scheduling a large number of collabs prior to her retirement, along with teasing a special Council collab stream.
					</div>
				</li>
				<li>
					<div>
						<time dateTime="2022-07-16T00:00:00Z">{(new Intl.DateTimeFormat(undefined, dateStringOptions)).formatRange(new Date('2022-07-16T00:00:00Z'), new Date('2022-07-17T00:00:00Z'))}</time>
						Sana appears at Smash Con 2022 along with Bae, doing two panels as well as a meet-and-greet with lucky fans.
					</div>
				</li>
				<li>
					<div>
						<time dateTime="2022-07-19T03:18:20Z">{(new Date('2022-07-19T03:18:20Z')).toLocaleDateString(undefined, dateStringOptions)}</time>
						Council and IRyS band together to <Link href="https://www.youtube.com/watch?v=8irDdE1YUYw">defeat the Ender Dragon</Link>! Sana gets a few good hits in with a loaf of bread. Thanks to Fauna&apos;s leadership, the epic battle concludes swiftly.
					</div>
				</li>
				<li>
					<div>
						<time dateTime="2022-07-20T01:00:56Z">{(new Date('2022-07-20T01:00:56Z')).toLocaleDateString(undefined, dateStringOptions)}</time>
						Sana <Link href="https://www.youtube.com/watch?v=gawUszEwpnY">finishes her BEEG tower in Minecraft</Link>, along with Moona and Kronii&apos;s help.
					</div>
				</li>
				<li>
					<div>
						<time dateTime="2022-07-20T23:48:02Z">{(new Date('2022-07-20T23:48:02Z')).toLocaleDateString(undefined, dateStringOptions)}</time>
						HoloCouncil debuts their BEEGsmol 3D models (designed by Sana herself), in <Link href="https://www.youtube.com/watch?v=bFjuKhG2Hzc">a pseudo-anniversary celebration stream</Link>.
					</div>
				</li>
				<li>
					<div>
						<time dateTime="2022-07-30T23:00:41Z">{(new Date('2022-07-30T23:00:41Z')).toLocaleDateString(undefined, dateStringOptions)}</time>
						<Link href="https://www.youtube.com/watch?v=t8vPcBsVIqY">The graduation stream</Link>. With a canvas of art and goodbye messages from fellow Hololive members, a full HoloEN smol 3D concert, and an emotional conclusion (with one final, heartfelt &quot;Sananara&quot;), our eternal Astrogirl takes to the stars.<br/>
						Overall, it was truly a celebration of Sana&apos;s time in Hololive, and the love between Sana and her Sanallites.
					</div>
				</li>
				<li>
					<div>
						<time dateTime="2022-08-05T01:01:24Z">{(new Date('2022-08-05T01:01:24Z')).toLocaleDateString(undefined, dateStringOptions)}</time>
						Sana makes an appearance during Mumei&apos;s birthday celebration stream <Link href="https://www.youtube.com/watch?v=gpVQHURm76Q&t=13087s">with a pre-recorded video message</Link>.
					</div>
				</li>
			</ul>
			<div className="text-center">
				<em className="text-xs text-slate-500">All dates are displayed in your local timezone.</em>
			</div>
		</div>
	);
}
