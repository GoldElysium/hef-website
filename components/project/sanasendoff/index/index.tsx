
import { useState } from 'react';

import StarField from '../StarField';

export const Index = () => {
	// Eventually this component will display sana sitting on earth with a few
	// moons orbiting it, each moon represents a section of the project (messages,
	// pictures, videos, timeline)
  
	// True if the user is hovering over one of the moons. This will stop the
	// orbit in place so the user can click the moons easier.
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [pause, setPause] = useState(false);
  
	// TODO

	return (
		<div className="w-screen h-screen relative bg-black ">
			<StarField/>
		</div>
	);
};

export default Index;
