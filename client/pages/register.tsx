import Head from 'next/head';
import Link from 'next/link';
import { FormEvent, useState, ChangeEvent } from 'react';
import Axios from 'axios';

import InputGroup from '../components/InputGroup';

export default function Register() {
	const [input, setInput] = useState({
		username: '',
		email: '',
		password: '',
	});

	const [agreement, setAgreement] = useState(false);

	const [inputErrors, setInputErrors] = useState<any>({});

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setInput({ ...input, [name]: value });
	};

	const handleAgreementChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { checked } = e.target;
		setAgreement(checked);
	};

	const { username, email, password } = input;

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();

		try {
			await Axios.post('/auth/register', {
				username,
				email,
				password,
			});
			setInputErrors({});
		} catch (error) {
			setInputErrors(error.response.data);
		}
	};

	return (
		<div className='flex'>
			<Head>
				<title>Register</title>
				<meta name='description' content='Register page' />
			</Head>
			<div className="w-36 h-screen bg-cover bg-center bg-[url('/images/tiles.jpg')]"></div>
			<div className='flex flex-col justify-center pl-6'>
				<div className='w-72'>
					<h1 className='mb-2 text-lg '>Sign Up</h1>
					<p className='mb-10 text-xs'>
						By continuing, you are agree to our User Agreement and Pricacy
						Policy
					</p>
					<form onSubmit={handleSubmit}>
						<div className='mb-6'>
							<input
								type='checkbox'
								id='agreement'
								className='mr-1 align-middle cursor-pointer'
								checked={agreement}
								onChange={handleAgreementChange}
								name='agreement'
							/>
							<label htmlFor='agreement' className='text-xs cursor-pointer'>
								I agree to get emails about cool stuff on Readit
							</label>
						</div>
						<InputGroup
							className='mb-2'
							type='email'
							placeholder='EMAIL'
							value={email}
							setValue={handleInputChange}
							name='email'
							error={inputErrors.email}
						/>
						<InputGroup
							className='mb-2'
							type='text'
							placeholder='USErNAME'
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
							Sign Up
						</button>
					</form>
					<small>
						Already a Readitor
						<Link href='/login'>
							<a className='ml-1 text-blue-600 uppercase'>Sign In</a>
						</Link>
					</small>
				</div>
			</div>
		</div>
	);
}
