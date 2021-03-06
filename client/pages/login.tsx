import { FormEvent, useState, ChangeEvent, useEffect } from 'react';

import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

import Axios from 'axios';

import InputGroup from '../components/InputGroup';

import { useAuthDispatch, useAuthState } from '../context/auth';

export default function Login() {
	const [input, setInput] = useState({
		username: '',
		password: '',
	});

	const [inputErrors, setInputErrors] = useState<any>({});

	const dispatch = useAuthDispatch();
	const { authenticated } = useAuthState();

	useEffect(() => {
		if (authenticated) router.push('/');
	}, [authenticated]);

	const router = useRouter();

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setInput({ ...input, [name]: value });
		setInputErrors({});
	};

	const { username, password } = input;

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();

		try {
			const res = await Axios.post('/auth/login', {
				username,
				password,
			});

			dispatch({ type: 'LOGIN', payload: res.data });

			router.back();
		} catch (error) {
			console.log(error.response.data.error);
			setInputErrors(error.response.data);
		}
	};

	return (
		<div className='flex bg-white'>
			<Head>
				<title>Login</title>
				<meta name='description' content='Login page' />
			</Head>
			<div className="w-36 h-screen bg-cover bg-center bg-[url('/images/tiles.jpg')]"></div>
			<div className='flex flex-col justify-center pl-6'>
				<div className='w-72'>
					<h1 className='mb-2 text-lg '>Login</h1>
					<form onSubmit={handleSubmit}>
						<InputGroup
							className='mb-2'
							type='text'
							placeholder='USERNAME'
							value={username}
							setValue={handleInputChange}
							name='username'
							error={inputErrors.username}
						/>
						<InputGroup
							className='mb-2'
							type='password'
							placeholder='PASSWORD'
							value={password}
							setValue={handleInputChange}
							name='password'
							error={inputErrors.password}
						/>
						<button className='w-full py-2 mb-4 text-xs font-bold text-white uppercase bg-blue-500 border border-blue-500 rounded hover:bg-blue-400'>
							LOG IN
						</button>
					</form>
					<small>
						New To Readit?
						<Link href='/register'>
							<a className='ml-1 text-blue-600 uppercase'>Sign Up</a>
						</Link>
					</small>
				</div>
			</div>
		</div>
	);
}
