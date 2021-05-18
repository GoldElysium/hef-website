import ReactPlayer from 'react-player';
import { useEffect, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline';
import Error from 'next/error';
import { useRouter } from 'next/router';
import ReactMarkdown from 'react-markdown';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import { IProject } from '../../models/Project';
import { ISubmission } from "../../models/Submission";

export default function ProjectPage() {
	const router = useRouter();

	const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
	const [currentSubmissionIndex, setCurrentSubmissionIndex] = useState(0);

	const [doc, setDoc] = useState<IProject>({} as IProject);
	const [submissions, setSubmissions] = useState<ISubmission[]>([]);

	const [errorCode, setErrorCode] = useState<boolean | number>(false);

	useEffect(() => {
		async function run() {
			if (!router.query.id) return;
			const res = await fetch(`/api/projects/${router.query.id}`, {
				method: 'GET',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json;charset=UTF-8',
				},
			});
			// eslint-disable-next-line consistent-return
			if (!res.ok) return setErrorCode(res.status);

			const submissionsRes = await fetch(`/api/submissions/${router.query.id}`, {
				method: 'GET',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json;charset=UTF-8',
				},
			});
			// eslint-disable-next-line consistent-return
			if (!submissionsRes.ok) return setErrorCode(submissionsRes.status);

			const json: IProject = await res.json();
			setDoc(json);
			const submissionsJson: ISubmission[] = await submissionsRes.json();
			setSubmissions(submissionsJson);
		}

		run();
	}, [router.query]);

	function CurrentGalleryItem() {
		if (!doc.media) return <></>;
		if (doc.media[currentMediaIndex].type === 'video') {
			return <ReactPlayer width="100%" height="100%" url={doc.media[currentMediaIndex].src} controls light/>;
		}
		if (doc.media[currentMediaIndex].type === 'image') {
			return <img className="w-full h-full object-none" src={doc.media[currentMediaIndex].src} alt="" loading="lazy" />;
		}
		return <p>Invalid media</p>;
	}

	function SubmissionItem(submission: ISubmission) {
		if (submission.type === 'video') {
			return <ReactPlayer width="100%" height="100%" url={ submission.src} controls light className="mb-6 mt-6"/>;
		}
		if (submission.type === 'image') {
			return <img className="w-full h-full object-none" src={ submission.src} alt="" loading="lazy" />;
		}
		if (submission.type === 'text') {
			return <p className="m-6 whitespace-pre-line">{submission.message}</p>;
		}
		return <p>Invalid media</p>;
	}

	function Submissions() {
		const submissionElements: JSX.Element[] = [];
		submissions.forEach((submission, index) => {
			const author = (submission.author)
				? <h6 className="text-xl left-0 top-0 w-1/2">From: <span className="font-medium">{submission.author}</span></h6>
				: <div className="left-0 top-0 w-1/2"></div>;
			submissionElements.push(
				<div className="w-full max-h-full" key={`submission-${index}`}>
					<div className="w-full flex">
						{author}
						<h6 className="text-xl top-0 right-0 w-1/2 text-right">{`#${index+1}`}</h6>
					</div>
					<div className="w-full mt-3">
						<SubmissionItem {...submission} />
						<hr/>
					</div>
				</div>
			);
		});

		return (
		    <div className="w-full h-full flex justify-center">
			    <div className="sm:w-8/12 h-full">
				    {submissionElements}
			    </div>
		    </div>
		);
	}

	if (errorCode) {
		return <Error statusCode={errorCode as number}/>;
	}

	return (
		<div className="flex flex-col h-full min-h-screen bg-red-50">
			<Navbar/>

			<Header title={doc.title ?? 'unknown'} description={doc.shortDescription ?? ''}/>

			<div className="flex-grow">
				<div className="my-16 w-full flex flex-col items-center">
					<div className="max-w-4xl w-full mx-4 break-words md:break-normal">
						<div>
							<h1 className="text-2xl text-red-500 font-bold border-b-2 border-red-200 text-center sm:text-left mb-3">Description</h1>
							<ReactMarkdown className="px-4 sm:px-0">
								{doc.description}
							</ReactMarkdown>
						</div>
						{((doc.media?.length ?? 0) > 0) && <div className="mt-4">
							<h1 className="text-2xl text-red-500 font-bold border-b-2 border-red-200 text-center sm:text-left my-3">Gallery</h1>
							<div className="flex flex-col items-center pt-2">
								<div className="w-full h-52 sm:w-8/12 sm:h-96">
									<CurrentGalleryItem/>
								</div>
								<div className="flex mt-2 font-bold items-center justify-center text-center">
									<ChevronLeftIcon
										className={currentMediaIndex > 0 ? 'text-black h-8 w-8 cursor-pointer' : 'text-red-300 h-8 w-8'}
										onClick={() => {
											if (currentMediaIndex > 0) setCurrentMediaIndex(currentMediaIndex - 1);
										}}
									/>
									{currentMediaIndex + 1}/{doc.media ? doc.media.length : 0}
									<ChevronRightIcon
										className={currentMediaIndex + 1 < (doc.media ? doc.media.length : 0) ? 'text-black h-8 w-8 cursor-pointer' : 'text-red-300 h-8 w-8'}
										onClick={() => {
											if (currentMediaIndex + 1 < (doc.media ? doc.media.length : 0)) setCurrentMediaIndex(currentMediaIndex + 1);
										}}
									/>
								</div>
							</div>
						</div>}
						{/* TODO: Move submissions to separate tab */}
						{((submissions?.length ?? 0) > 0) && <div className="mt-4">
							<h1 className="text-2xl text-red-500 font-bold border-b-2 border-red-200 text-center sm:text-left my-3">Submissions</h1>
							<div className="flex flex-col items-center pt-2">
								<div className="w-full max-h-[960px] overflow-auto">
									<Submissions />
								</div>
							</div>
						</div>}
						{((doc.links?.length ?? 0) > 0) && <div className="mt-4">
							<h1 className="text-2xl text-red-500 font-bold border-b-2 border-red-200 text-center sm:text-left mb-3">Links</h1>
							<div className="flex px-4 sm:px-0">
								{doc.links && doc.links.map((link, index) => (
									<div key={`link-${index}`}
										className="rounded-3xl bg-red-500 text-white font-bold w-20 h-10 flex items-center justify-center mt-4 content-end hover:text-red-200 mr-4">
										<a href={link.link} target="_blank" rel="noreferrer">{link.name}</a>
									</div>
								))}
							</div>
						</div>}
					</div>
				</div>
			</div>

			<Footer/>
		</div>
	);
}