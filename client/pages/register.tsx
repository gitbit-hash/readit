import Head from 'next/head';
import Link from 'next/link';

export default function Register() {
	return (
		<div className='flex'>
			<Head>
				<title>Register</title>
				<meta name='description' content='Register page' />
			</Head>
			<div className="w-40 h-screen bg-cover bg-center bg-[url('/images/tiles.jpg')]"></div>
			<div className='flex flex-col justify-center pl-6'>
				<div className='w-72'>
					<h1 className='mb-2 text-lg '>Sign Up</h1>
					<p className='mb-10 text-xs'>
						By continuing, you are agree to our User Agreement and Pricacy
						Policy
					</p>
					<form>
						<div className='mb-6'>
							<input
								type='checkbox'
								id='agreement'
								className='mr-1 align-middle cursor-pointer'
							/>
							<label htmlFor='agreement' className='text-xs cursor-pointer'>
								I agree to get emails about cool stuff on Readit
							</label>
						</div>
						<div className='mb-2'>
							<input
								type='email'
								className='w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded outline-none placeholder:uppercase'
								placeholder='Email'
							/>
						</div>
						<div className='mb-2'>
							<input
								type='text'
								className='w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded outline-none placeholder:uppercase'
								placeholder='Username'
							/>
						</div>
						<div className='mb-2'>
							<input
								type='password'
								className='w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded outline-none placeholder:uppercase'
								placeholder='Password'
							/>
						</div>
						<button className='w-full py-2 mb-4 text-xs font-bold text-white uppercase bg-blue-500 border border-blue-500 rounded hover:bg-blue-400'>
							Sign Up
						</button>
					</form>
					<small>
						Already a Readitor
						<Link href='/login'>
							<a className='ml-1 text-blue-500 uppercase'>Sign In</a>
						</Link>
					</small>
				</div>
			</div>
		</div>
	);
}
