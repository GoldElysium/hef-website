// eslint-disable-next-line import/no-extraneous-dependencies
import 'tailwindcss/tailwind.css';
import { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<div className="bg-red-50 h-full">
			<Component {...pageProps} />
		</div>
	);
}

export default MyApp;
