
import dynamic from 'next/dynamic';

export default dynamic(() => import('./index/index'), {
	loading: () => {
		return (
			<div className="w-screen h-screen flex justify-center content-center bg-black">
				<p className="animate-spin text-white">Loading...</p>
			</div>
		);
	},
});
