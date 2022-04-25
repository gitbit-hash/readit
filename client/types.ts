export interface Post {
	title: string;
	body?: string;
	username: string;
	createdAt: string;
	updatedAt: string;
	identifier: string;
	slug: string;
	subName: string;
	// Virtual fields (not exist in database)
	url: string;
	voteScore?: number;
	commentCount?: number;
	userVote?: number;
}
