import Axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { useAuthState, useAuthDispatch } from '../context/auth';

import RedditLogo from '../public/images/reddit-logo.svg';
import { Sub } from '../types';

const Navbar: React.FC = () => {
	const [name, setName] = useState('');
	const [subs, setSubs] = useState<Sub[]>([]);
	const [timer, setTimer] = useState(null);

	const { authenticated, loading } = useAuthState();
	const dispatch = useAuthDispatch();

	const router = useRouter();

	const logout = async () => {
		Axios.get('/auth/logout')
			.then(() => {
				dispatch({ type: 'LOGOUT' });
				window.location.reload();
			})
			.catch((error) => console.log(error));
	};

	useEffect(() => {
		if (name.trim() === '') {
			setSubs([]);
			return;
		}

		searchSubs();
	}, [name]);

	const searchSubs = async () => {
		clearTimeout(timer);
		setTimer(
			setTimeout(async () => {
				try {
					const { data } = await Axios.get(`/subs/search/${name}`);
					setSubs(data);
				} catch (error) {
					console.log(error);
				}
			}, 250)
		);
	};

	const goToSub = (subName: string) => {
		router.push(`/r/${subName}`);
		setName('');
	};

	return (
		<div className='fixed inset-x-0 top-0 z-10 flex items-center justify-between h-12 bg-white'>
			{/* Logo and title */}
			<div className='flex items-center '>
				<Link href='/'>
					<a>
						<RedditLogo className='w-12 h-12' />
					</a>
				</Link>
				<span className='hidden text-2xl font-semibold lg:block'>
					<Link href='/'>readit</Link>
				</span>
			</div>
			{/* Search Input */}
			<div className='max-w-full px-4 w-160'>
				<div className='relative flex items-center border rounded group hover:border-blue-400 bg-gray-50 hover:bg-white'>
					<input
						type='text'
						className='order-2 w-full py-1 pr-3 bg-transparent rounded peer focus:outline-none outline-1 group-hover:bg-white focus:bg-white'
						placeholder='Search Readit'
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
					<div className='absolute left-0 right-0 bg-white top-full'>
						{subs?.map((sub) => (
							<div
								key={sub.name}
								className='flex items-center px-4 py-3 cursor-pointer hover:bg-gray-200'
								onClick={() => goToSub(sub.name)}
							>
								<Image
									className='rounded-full'
									src={sub.imageUrl}
									alt='Sub'
									width={(8 * 16) / 4}
									height={(8 * 16) / 4}
								/>
								<div className='ml-4 text-sm'>
									<p className='font-medium'>{sub.name}</p>
									<p className='text-gray-500'>{sub.title}</p>
								</div>
							</div>
						))}
					</div>
					<div className='order-1 rounded group-hover:bg-white peer-focus:bg-white'>
						<i className='ml-3 mr-2 text-2xl text-gray-400 fa-solid fa-magnifying-glass' />
					</div>
				</div>
			</div>
			{/* Auth buttons */}
			<div className='flex'>
				{!loading &&
					(authenticated ? (
						<button
							className='hidden w-20 py-1 mr-3 leading-6 sm:block lg:w-32 hollow blue custom-button'
							onClick={logout}
						>
							Log Out
						</button>
					) : (
						<>
							<Link href='/login'>
								<a className='hidden w-20 py-1 mr-3 leading-6 sm:block lg:w-32 hollow blue custom-button'>
									Log In
								</a>
							</Link>
							<Link href='/register'>
								<a className='hidden w-20 py-1 leading-6 sm:block lg:w-32 blue custom-button'>
									Sign Up
								</a>
							</Link>
						</>
					))}
				<Link href='/'>
					<a className='flex items-center justify-center w-8 h-8 mx-2 bg-gray-100 rounded-full hover:bg-gray-200'>
						<i className='text-gray-600 fa-solid fa-bullhorn' />
					</a>
				</Link>
			</div>
		</div>
	);
};

export default Navbar;
