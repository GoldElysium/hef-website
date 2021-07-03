import axios from 'axios';
import { GetStaticProps } from 'next';

interface IProps {
	count: number
}

export default function SubscriberCount({ count }: IProps) {
	return (
		<>
			{count}
		</>
	);
}

export const getStaticProps: GetStaticProps = async () => {
	const res = await axios.get('https://holodex.net/api/v2/channels/UCoSrY_IQQVpmIRZ9Xf-y93g', {
		headers: {
			'X-APIKEY': process.env.HOLODEX_APIKEY,
		},
	});

	return {
		props: {
			count: res.data.subscriber_count,
		},
		revalidate: 120,
	};
};
