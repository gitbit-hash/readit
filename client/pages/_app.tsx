import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { SWRConfig } from 'swr';

import Axios from 'axios';

import Navbar from '../components/Navbar';

import { AuthProvider } from '../context/auth';

import '../styles/tailwind.css';
import '../styles/icons.css';

Axios.defaults.baseURL = 'http://localhost:5000/api';
Axios.defaults.withCredentials = true;

const fetcher = async (url: string) => {
	try {
		const res = await Axios.get(url);
		return res.data;
	} catch (error) {
		throw error.response.data;
	}
};

export default function MyApp({ Component, pageProps }: AppProps) {
	const { pathname } = useRouter();
	const authRoutes = ['/login', '/register'];
	const isAuthRoute = authRoutes.includes(pathname);

	return (
		<SWRConfig
			value={{
				fetcher,
				dedupingInterval: 10000,
			}}
		>
			<AuthProvider>
				{!isAuthRoute && <Navbar />}
				<Component {...pageProps} />;
			</AuthProvider>
		</SWRConfig>
	);
}
