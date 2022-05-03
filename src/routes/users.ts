import { Request, Response, Router } from 'express';
import { AppDataSource } from '../data-source';
import { Comment } from '../entities/Comment';
import { Post } from '../entities/Post';
import { User } from '../entities/User';

import { user } from '../middlewares/user';

const getUserSubmissions = async (req: Request, res: Response) => {
	try {
		const user = await AppDataSource.getRepository(User).findOneOrFail({
			where: {
				username: req.params.username,
			},
			select: ['username', 'createdAt'],
		});

		const posts = await AppDataSource.getRepository(Post).find({
			where: {
				username: user.username,
			},
			relations: ['comments', 'votes', 'sub'],
		});

		const comments = await AppDataSource.getRepository(Comment).find({
			where: {
				username: user.username,
			},
			relations: ['post'],
		});

		if (res.locals.user) {
			posts.forEach((post) => post.setUserVote(res.locals.user));
			comments.forEach((comment) => comment.setUserVote(res.locals.user));
		}

		let submissions: any[] = [];

		posts.forEach((post) =>
			submissions.push({ type: 'Post', ...post.toJSON() })
		);
		comments.forEach((comment) =>
			submissions.push({ type: 'Comment', ...comment.toJSON() })
		);

		submissions.sort((a, b) => {
			if (b.createdAt > a.createdAt) return 1;
			if (b.createdAt < a.createdAt) return -1;
			return 0;
		});

		return res.json({ user, submissions });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ error: 'Something went wrong!' });
	}
};

const router = Router();

router.get('/:username', user, getUserSubmissions);

export default router;
