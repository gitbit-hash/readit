import type { AppProps } from 'next/app';
import Axios from 'axios';

import '../styles/globals.css';

Axios.defaults.baseURL = 'http://localhost:5000/api';
Axios.defaults.withCredentials = true;

export default function MyApp({ Component, pageProps }: AppProps) {
	return <Component {...pageProps} />;
}
