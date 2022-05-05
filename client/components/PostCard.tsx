import Link from 'next/link';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Axios from 'axios';
import { useSWRConfig } from 'swr';

import { Post } from '../types';

interface PostCardProps {
	post: Post;
}

dayjs.extend(relativeTime);

function PostCard({ post }: PostCardProps) {
	const { mutate } = useSWRConfig();

	const vote = async (value: number) => {
		if (value === post.userVote) value = 0;

		try {
			await Axios.post('/misc/vote', {
				identifier: post.identifier,
				slug: post.slug,
				value,
			});
			mutate('/posts');
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div
			key={post.identifier}
			className='flex mb-4 bg-white rounded'
			id={post.identifier}
		>
			{/* Vote section */}
			<div className='w-10 py-3 text-center rounded-l bg-gray-50'>
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
			{/* Post data section */}
			<div className='w-full p-2'>
				<div className='flex items-center'>
					<Link href={`/r/${post.subName}`}>
						<img
							className='w-6 h-6 mr-1 rounded-full cursor-pointer'
							src='https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
							alt='gravatar'
						/>
					</Link>
					<Link href={`/r/${post.subName}`}>
						<a className='text-xs font-bold hover:underline'>
							/r/{post.subName}
						</a>
					</Link>
					<p className='text-xs text-gray-500'>
						<span className='mx-1'>•</span> Posted by
						<Link href={`/u/${post.username}`}>
							<a className='mx-1 hover:underline'>/u/{post.username}</a>
						</Link>
						<Link href={post.url}>
							<a className='mx-1 hover:underline'>
								{dayjs(post.createdAt).fromNow()}
							</a>
						</Link>
					</p>
				</div>
				<Link href={post.url}>
					<a className='my-1 text-lg font-medium'>{post.title}</a>
				</Link>
				{post.body && <p className='my-1 text-sm'>{post.body}</p>}
				<div className='flex'>
					<Link href={post.url}>
						<a>
							<div className='px-1 py-1 mr-1 text-xs text-gray-500 rounded cursor-pointer hover:bg-gray-300'>
								<i className='mr-1 fa-solid fa-xs fa-message'></i>
								<span className='text-xs font-bold'>{post.commentCount}</span>
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
	);
}

export default PostCard;
