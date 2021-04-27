import ReactPlayer from 'react-player';
import { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Header from '../../components/Header';

export default function ProjectPage() {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [media, setMedia] = useState([
		{
			type: 'video',
			src: 'https://www.youtube.com/watch?v=IKKar5SS29E',
		},
		{
			type: 'image',
			src: 'https://cdn.discordapp.com/attachments/835573181816242206/836454363756757033/EiCi2BmUMAAr7Ce.jpg',
		},
	]);

	function CurrentGalleryItem() {
		if (media[currentIndex].type === 'video') {
			return <ReactPlayer width="100%" height="100%" url={media[currentIndex].src} controls light/>;
		}
		if (media[currentIndex].type === 'image') {
			return <img className="w-full h-full" src={media[currentIndex].src} alt=""/>;
		}
		return <p>Invalid media</p>;
	}

	return (
		<div className="flex flex-col h-full min-h-screen bg-red-50">
			<Navbar/>

			<Header title="Project X" description="Short description"/>

			<div className="flex-grow">
				<div className="my-16 w-full flex flex-col items-center">
					<div className="max-w-4xl w-full mx-4" >
						<div>
							<h1 className="text-2xl text-red-500 font-bold border-b-2 border-red-200 text-center sm:text-left mb-3">Description</h1>
							<p>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur sit amet elementum magna.
								Vestibulum ut neque varius, volutpat justo sed, pellentesque felis. Morbi quam tellus,
								scelerisque ac venenatis vel, gravida vitae nisl. Morbi congue euismod metus a vestibulum.
								Vestibulum tempor dolor nisi, ut volutpat est consectetur ut. Vestibulum hendrerit id mauris
								non vestibulum. Etiam quis orci eu ante iaculis pretium. Donec congue condimentum consequat.
								Mauris metus ligula, venenatis non dictum non, bibendum nec lorem. Suspendisse gravida arcu
								eget orci vulputate, id imperdiet lectus scelerisque. Aenean consequat blandit nulla, id
								aliquam lectus volutpat a.
							</p>
						</div>
						<div>
							<h1 className="text-2xl text-red-500 font-bold border-b-2 border-red-200 text-center sm:text-left my-3">Gallery</h1>
							<div className="flex flex-col items-center pt-2">
								<div className="w-full h-52 sm:w-8/12 sm:h-96">
									<CurrentGalleryItem/>
								</div>
								<div className="flex mt-2 font-bold items-center justify-center text-center">
									<ChevronLeftIcon
										className={currentIndex > 0 ? 'text-black h-8 w-8 cursor-pointer' : 'text-red-300 h-8 w-8'}
										onClick={() => {
											if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
										}}
									/>
									{currentIndex + 1}/{media.length}
									<ChevronRightIcon
										className={currentIndex + 1 < media.length ? 'text-black h-8 w-8 cursor-pointer' : 'text-red-300 h-8 w-8'}
										onClick={() => {
											if (currentIndex + 1 < media.length) setCurrentIndex(currentIndex + 1);
										}}
									/>
								</div>
							</div>
						</div>
						<div>
							<h1 className="text-2xl text-red-500 font-bold border-b-2 border-red-200 text-center sm:text-left mb-3">Links</h1>
							<div className="flex">
								<div className="rounded-3xl bg-red-500 text-white font-bold w-20 h-10 flex items-center justify-center mt-4 content-end hover:text-red-200 mr-4">
									<a href="#">Link 1</a>
								</div>
								<div className="rounded-3xl bg-red-500 text-white font-bold w-20 h-10 flex items-center justify-center mt-4 content-end hover:text-red-200 mr-4">
									<a href="#">Link 2</a>
								</div>
								<div className="rounded-3xl bg-red-500 text-white font-bold w-20 h-10 flex items-center justify-center mt-4 content-end hover:text-red-200 mr-4">
									<a href="#">Link 3</a>
								</div>
								<div className="rounded-3xl bg-red-500 text-white font-bold w-20 h-10 flex items-center justify-center mt-4 content-end hover:text-red-200 mr-4">
									<a href="#">Link 4</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<Footer/>
		</div>
	);
}