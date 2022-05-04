import axios from 'axios';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';

export default function Create() {
	const [name, setName] = useState('');
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [errors, setErrors] = useState<Partial<any>>({});

	const router = useRouter();

	const submitForm = async (event: FormEvent) => {
		event.preventDefault();

		try {
			const { data } = await axios.post('/subs', { name, title, description });

			router.push(`/r/${data.name}`);
		} catch (error) {
			console.log(error);
			setErrors(error.response.data);
		}
	};

	return (
		<div className='flex bg-white'>
			<Head>
				<title>Create A Community</title>
			</Head>
			<div className="w-36 h-screen bg-cover bg-center bg-[url('/images/tiles.jpg')]"></div>
			<div className='flex flex-col justify-center pl-6'>
				<div className='w-96'>
					<h1 className='mb-2 text-lg font-semibold'>Create a Community</h1>
					<hr />
					<form onSubmit={submitForm}>
						<div className='my-6'>
							<p className='font-semibold'>Name</p>
							<p className='mb-2 text-xs text-gray-500'>
								Community names including capitalization cannot be changed.
							</p>
							<input
								type='text'
								// className='w-full p-3 border border-gray-200 rounded hover:border-gray-500'
								className={`w-full p-3 transition border ${
									errors.name ? 'border-red-500' : 'border-gray-200'
								} rounded placeholder:uppercase hover:border-gray-500`}
								value={name}
								onChange={(e) => setName(e.target.value)}
							/>
							<small className='font-medium text-red-500'>{errors.name}</small>
						</div>
						<div className='my-6'>
							<p className='font-semibold'>Title</p>
							<p className='mb-2 text-xs text-gray-500'>
								Community title represents the topic, and you can change it any
								time.
							</p>
							<input
								type='text'
								className={`w-full p-3 transition border ${
									errors.title ? 'border-red-500' : 'border-gray-200'
								} rounded placeholder:uppercase hover:border-gray-500`}
								value={title}
								onChange={(e) => setTitle(e.target.value)}
							/>
							<small className='font-medium text-red-500'>{errors.title}</small>
						</div>
						<div className='my-6'>
							<p className='font-semibold'>Description</p>
							<p className='mb-2 text-xs text-gray-500'>
								This is how new members come to understand your community.
							</p>
							<textarea
								className={`w-full p-3 transition border ${
									errors.description ? 'border-red-500' : 'border-gray-200'
								} rounded placeholder:uppercase hover:border-gray-500`}
								value={description}
								onChange={(e) => setDescription(e.target.value)}
							/>
							<small className='font-medium text-red-500'>
								{errors.description}
							</small>
						</div>
						<div className='flex justify-end'>
							<button className='px-4 py-1 text-sm font-semibold capitalize blue custom-button'>
								Create Community
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
	const cookie = req.headers.cookie;

	try {
		if (!cookie) throw new Error('Missing auth token cookie');

		await axios.get('/auth/me', { headers: { cookie } });

		return { props: {} };
	} catch (error) {
		res.writeHead(307, { Location: '/login' }).end();
	}
};
