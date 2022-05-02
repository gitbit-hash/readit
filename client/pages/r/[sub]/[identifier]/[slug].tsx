import Axios from 'axios';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import Sidebar from '../../../../components/Sidebar';
import { Post } from '../../../../types';
import { useAuthState } from '../../../../context/auth';

dayjs.extend(relativeTime);

export default function PostPage() {
	const { authenticated } = useAuthState();

	const router = useRouter();

	const { identifier, sub, slug } = router.query;

	const { data: post, error } = useSWR<Post>(
		identifier && slug ? `/posts/${identifier}/${slug}` : null
	);

	if (error) router.push('/');

	const vote = async (value: number) => {
		if (!authenticated) router.push('/login');

		if (value === post.userVote) value = 0;

		try {
			const res = await Axios.post('/misc/vote', {
				identifier: post.identifier,
				slug: post.slug,
				value,
			});
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<>
			<Head>
				<title>{post?.title}</title>
			</Head>
			<Link href={`/r/${sub}`}>
				<a className='flex items-center w-full h-20 p-8 bg-blue-500'>
					<div className='container flex'>
						{post && (
							<div className='w-8 h-8 mr-2 overflow-hidden rounded-full'>
								<Image
									src={post.sub.imageUrl}
									width={(8 * 16) / 4}
									height={(8 * 16) / 4}
								/>
							</div>
						)}
						<p className='text-xl font-semibold text-white'>/r/${sub}</p>
					</div>
				</a>
			</Link>
			<div className='container flex pt-5'>
				{/* Post */}
				<div className='w-160'>
					<div className='bg-white rounded'>
						{post && (
							<div className='flex'>
								{/* Vote section */}
								<div className='w-10 py-3 text-center rounded-l'>
									{/* Up vote */}
									<div
										className='w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500'
										onClick={() => vote(1)}
									>
										<i
											className={`icon-arrow-up ${
												post.userVote === 1 && 'text-red-500 '
											}`}
										></i>
									</div>
									{/* Votes score */}
									<p className='my-1 text-xs font-bold'>{post.voteScore}</p>
									{/* Down vote */}
									<div
										className='w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-500'
										onClick={() => vote(-1)}
									>
										<i
											className={`icon-arrow-down ${
												post.userVote === -1 && 'text-blue-500 '
											}`}
										></i>
									</div>
								</div>
								<div className='p-2'>
									<div className='flex items-center'>
										<p className='text-xs text-gray-500'>
											Posted by
											<Link href={`/u/${post.username}`}>
												<a className='mx-1 hover:underline'>
													/u/{post.username}
												</a>
											</Link>
											<Link href={post.url}>
												<a className='mx-1 hover:underline'>
													{dayjs(post.createdAt).fromNow()}
												</a>
											</Link>
										</p>
									</div>
									{/* Post title */}
									<h1 className='my-1 text-xl font-medium'>{post.title}</h1>
									{/* Post body */}
									<p className='my-3 text-sm'>{post.body}</p>
									{/* Actions */}
									<div className='flex'>
										<Link href={post.url}>
											<a>
												<div className='px-1 py-1 mr-1 text-xs text-gray-500 rounded cursor-pointer hover:bg-gray-300'>
													<i className='mr-1 fa-solid fa-xs fa-message'></i>
													<span className='text-xs font-bold'>
														{post.commentCount}
													</span>
												</div>
											</a>
										</Link>
										<div className='px-1 py-1 mr-1 text-xs text-gray-500 rounded cursor-pointer hover:bg-gray-300'>
											<i className='mr-1 fa-solid fa-xs fa-share'></i>
											<span className='font-bold'>Share</span>
										</div>
										<div className='px-1 py-1 mr-1 text-xs text-gray-500 rounded cursor-pointer hover:bg-gray-300'>
											<i className='mr-1 fa-solid fa-xs fa-bookmark'></i>
											<span className='font-bold'>Save</span>
										</div>
									</div>
								</div>
							</div>
						)}
					</div>
				</div>
				{/* Sidebar */}
				{post && <Sidebar sub={post.sub} />}
			</div>
		</>
	);
}
