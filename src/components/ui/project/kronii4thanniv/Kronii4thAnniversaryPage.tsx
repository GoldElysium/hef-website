import fetchSubmissions from '@/lib/fetchSubmissions';
import type { Project } from '@/types/payload-types';
import Submission from '@/components/ui/project/Submission';
import DarkModeToggle from '@/components/ui/DarkModeToggle';
import BackgroundMusic from '@/components/ui/project/kronii4thanniv/BackgroundMusic';
import { HeartIcon } from '@heroicons/react/24/solid';
import UserCard, { type User } from './UserCard';
import MobileNav from './MobileNav';
import marqueeStyles from './marquee.module.css';

interface IProps {
	project: Omit<Project, 'flags' | 'devprops'> & {
		flags: string[]; devprops: {
			[key: string]: string;
		};
	};
}

export default async function Kronii4thAnniversaryPage({ project }: IProps) {
	const submissions = await fetchSubmissions(project);

	const credits: User[] = (JSON.parse(project.devprops.credits) as User[])
		.map((user) => ({
			...user,
			socials: user.socials.map((social) => ({
				url: social.url,
				icon: (() => {
					switch (social.icon as string) {
						case 'github':
							return (
								<svg
									role="img"
									viewBox="0 0 24 24"
									fill="currentColor"
									className="size-6"
									xmlns="http://www.w3.org/2000/svg"
								>
									<title>GitHub</title>
									<path
										d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
									/>
								</svg>
							);
						case 'x':
							return (
								<svg
									role="img"
									viewBox="0 0 24 24"
									fill="currentColor"
									className="size-6"
									xmlns="http://www.w3.org/2000/svg"
								>
									<title>X</title>
									<path
										d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"
									/>
								</svg>
							);
						default:
							return null;
					}
				})(),
			})),
		}));

	return (
		<div
			className="cursor-[url(https://cdn.holoen.fans/hefw/assets/kronii-anniversary-2025/cursor.png)_23_23,_auto]"
		>
			<div
				className="flex justify-between px-4 sm:px-8 py-4 fixed top-0 h-16 w-screen bg-skin-header items-center dark:bg-skin-header-dark z-50"
			>
				<div className={`${marqueeStyles.marquee} flex px-2 py-4 max-w-lg text-nowrap overflow-hidden text-xl`}>
					<p className={`${marqueeStyles.item} flex items-center`}>
						HAPPY 4TH ANNIVERSARY OURO KRONII
						<HeartIcon className="size-6 text-yellow-400 mx-4" />
					</p>
					<p className={`${marqueeStyles.item} flex items-center`}>
						HAPPY 4TH ANNIVERSARY OURO KRONII
						<HeartIcon className="size-6 text-yellow-400 mx-4" />
					</p>
				</div>
				<div className="hidden sm:flex gap-4 items-center">
					{/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
					<a href="#">TOP</a>
					<a href="#submissions">Submissions</a>
					<a href="#credits">Credits</a>
					<DarkModeToggle />
				</div>
				<div className="sm:hidden">
					<MobileNav />
				</div>
			</div>
			<div className="h-16 w-screen" />
			<div className="fixed h-screen w-screen overflow-x-hidden z-0 top-16">
				<video
					loop
					autoPlay
					muted
					disablePictureInPicture
					disableRemotePlayback
					className="object-cover object-center min-h-[100vh] min-w-[100vw]"
				>
					<source
						type="video/webm"
						src="https://cdn.holoen.fans/hefw/assets/kronii-anniversary-2025/art.webm"
					/>
				</video>
			</div>
			<div className="z-40 absolute top-[100vh] bg-white/60 dark:bg-black/60">
				<section
					id="submissions"
					className="px-4 md:px-16 lg:px-24 2xl:px-56 mt-16"
				>
					<h1 className="text-2xl lg:text-6xl text-center mb-6 text-skin-text dark:text-skin-text-dark">Submissions</h1>
					<div className="flex justify-center">
						<h2 className="text-xl lg:text-3xl text-center mb-12 text-skin-text dark:text-skin-text-dark max-w-4xl">
							Kronies gathered together to celebrate this special occasion to show our love
							and appreciation for everything you&apos;ve done over the years.
							Thank you, Kronii, for being our Warden of Time.
						</h2>
					</div>
					<div
						className="columns-1 lg:columns-3 gap-2 min-h-[calc(120%)]"
						style={{ contentVisibility: 'auto', columnGap: '2rem' }}
					>
						{submissions
							.map((submission) => ({ submission, sort: Math.random() }))
							.sort((a, b) => a.sort - b.sort)
							.map(({ submission }) => (
								<Submission
									submission={submission}
									key={submission.id}
									className="my-8 break-inside-avoid"
								/>
							))}
					</div>
				</section>
				<section
					id="credits"
					className="px-4 md:px-16 lg:px-24 2xl:px-56 mt-16"
				>
					<h1 className="text-xl lg:text-5xl text-center mb-8 text-skin-text dark:text-skin-text-dark">Credits</h1>
					<div className="flex gap-8 flex-wrap justify-center">
						{credits.map((user) => (<UserCard key={user.name} user={user} />))}
					</div>
				</section>
				<div className="pb-48" />
			</div>
			<BackgroundMusic src="https://cdn.holoen.fans/hefw/assets/kronii-anniversary-2025/bgm.ogg" />
		</div>
	);
}
