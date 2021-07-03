import axios from 'axios';

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

export async function getStaticProps() {
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
}
