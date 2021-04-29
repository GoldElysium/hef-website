// eslint-disable-next-line import/no-extraneous-dependencies
import 'tailwindcss/tailwind.css';
import { AppProps } from 'next/app';
import { Provider } from 'next-auth/client';

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<Provider session={pageProps.session}>
			<Component {...pageProps} />
		</Provider>
	);
}

export default MyApp;
