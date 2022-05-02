export interface Post {
	title: string;
	body?: string;
	username: string;
	createdAt: string;
	updatedAt: string;
	identifier: string;
	slug: string;
	subName: string;
	sub?: Sub;
	// Virtual fields (not exist in database)
	url: string;
	voteScore?: number;
	commentCount?: number;
	userVote?: number;
}

export interface User {
	username: string;
	email: string;
	createdAt: string;
	updatedAt: string;
}

export interface Sub {
	createdAt: string;
	updatedAt: string;
	name: string;
	title: string;
	description: string;
	imageUrn: string;
	bannerUrn: string;
	username: string;
	imageUrl: string;
	bannerUrl: string;
	posts: Post[];
	postCount?: number;
}
