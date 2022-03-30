import Link from 'next/link';
import React from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { Post } from '../types';

interface PostCardProps {
	post: Post;
}

dayjs.extend(relativeTime);

function PostCard({ post }) {
	return (
		<div key={post.identifier} className='flex mb-4 bg-white rounded'>
			{/* Vote section */}
			<div className='w-10 text-center bg-gray-200 rounded-l'>
				<p>V</p>
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
								<span className='font-bold'>20 Comments</span>
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
