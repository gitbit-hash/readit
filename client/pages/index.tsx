import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import useSWRInfinite from 'swr/infinite';

import PostCard from '../components/PostCard';
import { useAuthState } from '../context/auth';

import { Post, Sub } from '../types';

export default function Home() {
	const [observedPost, setObservedPost] = useState('');

	// const { data: posts } = useSWR<Post[]>('/posts');
	const { data: topSubs } = useSWR<Sub[]>('/misc/top-subs');

	// Get the fetcher from the global SWRConfig and pass it to useSWRInfinite
	const { fetcher } = useSWRConfig();

	const { authenticated } = useAuthState();

	const description =
		"Reddit is a network of communities where people can dive into their interests, hobbies and passions. There's a community for whatever you're interested in on Reddit.";
	const title = 'Reddit - Dive into anything';

	const {
		data,
		error,
		isValidating,
		mutate,
		size: page,
		setSize: setPage,
	} = useSWRInfinite((pageIndex) => `/posts?page=${pageIndex}`, fetcher, {
		// Don't revalidate the first page when loading more posts
		revalidateFirstPage: false,
	});

	const isInitialLoading = !data && !error;

	const posts: Post[] = data ? [].concat(...data) : [];

	useEffect(() => {
		if (!posts || posts.length === 0) return;

		const id = posts[posts.length - 1].identifier;

		if (id !== observedPost) {
			setObservedPost(id);
			observeElement(document.getElementById(id));
		}
	}, [posts]);

	const observeElement = (element: HTMLElement) => {
		if (!element) return;

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					setPage(page + 1);
					observer.unobserve(element);
				}
			},
			{ threshold: 1 }
		);

		observer.observe(element);
	};

	return (
		<>
			<Head>
				<title>{title}</title>
				<meta name='description' content={description}></meta>
				<meta property='og:description' content={description} />
				<meta property='og:title' content={title} />
				<meta property='twitter:description' content={description} />
				<meta property='twitter:title' content={title} />
			</Head>
			<div className='container flex pt-4'>
				{/* Posts feed */}
				<div className='w-full px-4 md:w-160 md:p-0'>
					{isInitialLoading && (
						<p className='text-lg text-center'>Loading...</p>
					)}
					{posts?.map((post) => (
						<PostCard post={post} key={post.identifier} mutate={mutate} />
					))}
					{isValidating && posts.length > 0 && (
						<p className='text-lg text-center'>Loading More...</p>
					)}
				</div>
				{/* Sidebar */}
				<div className='hidden ml-6 md:block w-80'>
					<div className='bg-white rounded'>
						<div className='p-4 border-b-2'>
							<p className='text-lg font-semibold text-center'>
								Top Communities
							</p>
						</div>
						<div>
							{topSubs?.map((sub) => (
								<div
									key={sub.name}
									className='flex items-center px-4 py-2 text-xs border-b'
								>
									<Link href={`/r/${sub.name}`}>
										<a>
											<Image
												src={sub.imageUrl}
												alt='Sub Image'
												width={(6 * 16) / 4}
												height={(6 * 16) / 4}
												className='rounded-full cursor-pointer'
											/>
										</a>
									</Link>
									<Link href={`/r/${sub.name}`}>
										<a className='ml-2 font-bold hover:cursor-pointer'>
											/r/{sub.name}
										</a>
									</Link>
									<p className='ml-auto font-medium'>{sub.postCount}</p>
								</div>
							))}
						</div>
						{authenticated && (
							<div className='p-4 border-t-2'>
								<Link href='/subs/create'>
									<a className='w-full px-2 py-1 rounded-sm blue custom-button'>
										Create Community
									</a>
								</Link>
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	);
}
