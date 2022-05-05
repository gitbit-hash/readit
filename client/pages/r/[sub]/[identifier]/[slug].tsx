import { FormEvent, useEffect, useState } from 'react';
import Axios from 'axios';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import Sidebar from '../../../../components/Sidebar';
import { Post, Comment } from '../../../../types';
import { useAuthState } from '../../../../context/auth';

dayjs.extend(relativeTime);

export default function PostPage() {
	// Local state
	const [newComment, setNewComment] = useState('');
	const [description, setDescription] = useState('');

	// Global state
	const { authenticated, user } = useAuthState();

	const router = useRouter();

	const { identifier, sub, slug } = router.query;

	const { data: comments, mutate: mutateComment } = useSWR<Comment[]>(
		identifier && slug ? `/posts/${identifier}/${slug}/comments` : null
	);

	const {
		data: post,
		error,
		mutate: mutatePost,
	} = useSWR<Post>(identifier && slug ? `/posts/${identifier}/${slug}` : null);

	if (error) router.push('/');

	useEffect(() => {
		if (!post) return;

		let desc = post.body || post.title;

		desc = desc.substring(0, 158).concat('..');

		setDescription(desc);
	}, [post]);

	const vote = async (value: number, comment?: Comment) => {
		if (!authenticated) router.push('/login');

		if (
			(!comment && value === post.userVote) ||
			(comment && comment.userVote === value)
		)
			value = 0;

		try {
			const res = await Axios.post('/misc/vote', {
				identifier,
				slug,
				commentIdentifier: comment?.identifier,
				value,
			});

			mutatePost(post);
			mutateComment(comments);
		} catch (error) {
			console.log(error);
		}
	};

	const submitComment = async (event: FormEvent) => {
		event.preventDefault();

		if (newComment.trim() === '') return;

		try {
			await Axios.post(`/posts/${post.identifier}/${post.slug}/comments`, {
				body: newComment,
			});

			setNewComment('');

			mutatePost(post);
			mutateComment(comments);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<>
			<Head>
				<title>{post?.title}</title>
				<meta name='description' content={description}></meta>
				<meta property='og:description' content={description} />
				<meta property='og:title' content={post?.title} />
				<meta property='twitter:description' content={description} />
				<meta property='twitter:title' content={post?.title} />
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
							<>
								<div className='flex'>
									{/* Vote section */}
									<div className='flex-shrink-0 w-10 py-3 text-center rounded-l'>
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
								{/* Comment input area */}
								<div className='pl-10 pr-6 mb-4'>
									{authenticated ? (
										<>
											<p className='mb-1 text-xs'>
												Comment as{' '}
												<Link href={`/u/${user.username}`}>
													<a className='font-semibold text-blue-500'>
														{user.username}
													</a>
												</Link>
											</p>
											<form onSubmit={submitComment}>
												<textarea
													className='w-full p-3 border border-gray-300 2-full focus:outline-none focus:border-gray-600'
													onChange={(e) => setNewComment(e.target.value)}
													value={newComment}
												></textarea>
												<div className='flex justify-end'>
													<button
														type='submit'
														className='px-3 py-1 blue custom-button'
														disabled={newComment.trim() === ''}
													>
														Comment
													</button>
												</div>
											</form>
										</>
									) : (
										<div className='flex items-center justify-between px-2 py-4 border border-gray-300 rounded'>
											<p className='font-semibold text-gray-400'>
												Log in or sign up to leave a comment.
											</p>
											<div>
												<Link href='/login'>
													<a className='px-4 py-1 mr-4 hollow blue custom-button'>
														Login
													</a>
												</Link>
												<Link href='/register'>
													<a className='px-4 py-1 blue custom-button'>
														Sign Up
													</a>
												</Link>
											</div>
										</div>
									)}
								</div>
								<hr />
								{/* Comments Section */}
								{comments?.map((comment) => (
									<div className='flex' key={comment.identifier}>
										<div className='flex-shrink-0 w-10 py-3 text-center rounded-l'>
											{/* Up vote */}
											<div
												className='w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500'
												onClick={() => vote(1, comment)}
											>
												<i
													className={`icon-arrow-up ${
														comment.userVote === 1 && 'text-red-500 '
													}`}
												></i>
											</div>
											{/* Votes score */}
											<p className='my-1 text-xs font-bold'>
												{comment.voteScore}
											</p>
											{/* Down vote */}
											<div
												className='w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-500'
												onClick={() => vote(-1, comment)}
											>
												<i
													className={`icon-arrow-down ${
														comment.userVote === -1 && 'text-blue-500 '
													}`}
												></i>
											</div>
										</div>
										<div className='p-2'>
											<p className='mb-1 text-xs leading-none'>
												<Link href={`/u/${comment.username}`}>
													<a className='mr-1 font-bold hover:underline'>
														{comment.username}
													</a>
												</Link>
												<span className='text-gray-600'>
													{`
													${comment.voteScore}
													points •
													${dayjs(comment.createdAt).fromNow()}
													`}
												</span>
											</p>
											<p>{comment.body}</p>
										</div>
									</div>
								))}
							</>
						)}
					</div>
				</div>
				{/* Sidebar */}
				{post && <Sidebar sub={post.sub} />}
			</div>
		</>
	);
}
