import { ChangeEvent, useEffect, useRef, useState } from 'react';
import Axios from 'axios';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import useSWR from 'swr';

import PostCard from '../../components/PostCard';
import Sidebar from '../../components/Sidebar';

import { Sub } from '../../types';
import { useAuthState } from '../../context/auth';

export default function SubPage() {
	// Local state
	const [ownSub, setOwnSub] = useState(false);

	//Global state
	const { authenticated, user } = useAuthState();

	const router = useRouter();

	const fileInputRef = useRef<HTMLInputElement>(null);

	const subName = router.query.sub;

	const {
		data: sub,
		error,
		mutate,
	} = useSWR<Sub>(subName ? `/subs/${subName}` : null);

	useEffect(() => {
		if (!sub) return;
		setOwnSub(authenticated && sub.username === user.username);
	}, [sub]);

	const openFileInput = (type: string) => {
		if (!ownSub) return;
		fileInputRef.current.name = type;
		fileInputRef.current.click();
	};

	const uploadImage = async (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files[0];

		if (!file) return;

		const formData = new FormData();
		formData.append('file', file);
		formData.append('type', fileInputRef.current.name);

		try {
			const res = await Axios.post<Sub>(`/subs/${sub.name}/image`, formData, {
				headers: { 'Contetnt-Type': 'multipart/form-data' },
			});

			// Sets imageUrl to the new updated imageUrl
			mutate({ ...sub, imageUrl: res.data.imageUrl });
		} catch (error) {
			console.log(error);
		}
	};

	if (error) router.push('/');

	let postMarkup;

	if (!sub) {
		postMarkup = <p className='text-center text-large'>Loading...</p>;
	} else if (sub.posts.length < 1) {
		postMarkup = (
			<p className='text-center text-large'>No posts submitted yet.</p>
		);
	} else {
		postMarkup = sub.posts.map((post) => (
			<PostCard key={post.identifier} post={post} mutate={mutate} />
		));
	}

	return (
		<div>
			<Head>
				<title>{sub?.title}</title>
			</Head>
			{sub && (
				<>
					<input type='file' hidden ref={fileInputRef} onChange={uploadImage} />
					{/* Sub info and images */}
					<div>
						<div
							className={`bg-blue-500 ${ownSub && 'cursor-pointer'}`}
							onClick={() => openFileInput('banner')}
						>
							{sub.bannerUrl ? (
								<div
									style={{ backgroundImage: `url(${sub.bannerUrl})` }}
									className={`h-56 bg-blue-500 bg-center bg-no-repeat bg-cover`}
								></div>
							) : (
								<div className='h-20 bg-blue-500'></div>
							)}
						</div>
						{/* Sub meta data */}
						<div className='h-20 bg-white'>
							<div className='container relative flex'>
								<div className='absolute -top-4'>
									<Image
										src={sub.imageUrl}
										alt='Sub'
										className={`bg-blue-500 rounded-full ${
											ownSub && 'cursor-pointer'
										}`}
										onClick={() => openFileInput('image')}
										width={70}
										height={70}
									/>
								</div>
								<div className='pt-1 pl-24'>
									<div className='flex items-center'>
										<h1 className='mb-1 text-3xl font-bold'>{sub.title}</h1>
									</div>
									<p className='text-sm font-bold text-gray-500'>
										/r/{sub.name}
									</p>
								</div>
							</div>
						</div>
					</div>
					{/* Posts and sidebar */}
					<div className='container flex pt-5'>
						<div className='w-160'>{postMarkup}</div>
						<Sidebar sub={sub} />
					</div>
				</>
			)}
		</div>
	);
}
