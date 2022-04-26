import Axios from 'axios';
import Link from 'next/link';

import { useAuthState, useAuthDispatch } from '../context/auth';

import RedditLogo from '../public/images/reddit-logo.svg';

const Navbar: React.FC = () => {
	const { authenticated, loading } = useAuthState();
	const dispatch = useAuthDispatch();

	const logout = async () => {
		Axios.get('/auth/logout')
			.then(() => {
				dispatch({ type: 'LOGOUT' });
				window.location.reload();
			})
			.catch((error) => console.log(error));
	};

	return (
		<div className='fixed inset-x-0 top-0 z-10 flex items-center justify-center h-12 px-5 bg-white'>
			{/* Logo and title */}
			<div className='flex items-center '>
				<Link href='/'>
					<a>
						<RedditLogo className='w-12 h-12 mr-2' />
					</a>
				</Link>
				<span className='text-2xl font-semibold'>
					<Link href='/'>readit</Link>
				</span>
			</div>
			{/* Search Input */}
			<div className='flex items-center mx-auto border rounded group w-160 hover:border-blue-400 bg-gray-50 hover:bg-white'>
				<input
					type='text'
					className='order-2 w-full py-1 pr-3 bg-transparent rounded peer focus:outline-none outline-1 group-hover:bg-white focus:bg-white'
					placeholder='Search Readit'
				/>
				<div className='order-1 rounded group-hover:bg-white peer-focus:bg-white'>
					<i className='ml-3 mr-2 text-2xl text-gray-400 fa-solid fa-magnifying-glass' />
				</div>
			</div>
			{/* Auth buttons */}
			<div className='flex'>
				{!loading &&
					(authenticated ? (
						<button
							className='w-32 py-1 mr-3 leading-6 hollow blue custom-button'
							onClick={logout}
						>
							Log Out
						</button>
					) : (
						<>
							<Link href='/login'>
								<a className='w-32 py-1 mr-3 leading-6 hollow blue custom-button'>
									Log In
								</a>
							</Link>
							<Link href='/register'>
								<a className='w-32 py-1 leading-6 blue custom-button'>
									Sign Up
								</a>
							</Link>
						</>
					))}
				<Link href='/'>
					<a className='flex items-center mx-2 bg-gray-100 rounded-full hover:bg-gray-200'>
						<i className='ml-3 mr-3 text-gray-600 fa-solid fa-bullhorn' />
					</a>
				</Link>
			</div>
		</div>
	);
};

export default Navbar;
