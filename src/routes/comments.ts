import { Request, Response, Router } from 'express';
import { AppDataSource } from '../data-source';

import { Comment } from '../entities/Comment';
import { Post } from '../entities/Post';

import { auth } from '../middlewares/auth';
import { user } from '../middlewares/user';

const addComment = async (req: Request, res: Response) => {
	const { identifier, slug } = req.params;
	const { body } = req.body;

	try {
		const post = await AppDataSource.getRepository(Post).findOneOrFail({
			where: {
				identifier,
				slug,
			},
		});

		const comment = new Comment({
			body,
			post,
			user: res.locals.user,
		});

		await comment.save();

		return res.json(comment);
	} catch (error) {
		console.log(error);
		return res.status(404).json({ error: 'Post not found!' });
	}
};

const getPostComments = async (req: Request, res: Response) => {
	const { identifier, slug } = req.params;

	try {
		const post = await AppDataSource.getRepository(Post).findOneByOrFail({
			identifier,
			slug,
		});

		const comments = await AppDataSource.getRepository(Comment).find({
			where: {
				post: {
					identifier: post.identifier,
				},
			},
			order: { createdAt: 'DESC' },
			relations: ['votes'],
		});

		if (res.locals.user) {
			comments.forEach((comment) => comment.setUserVote(res.locals.user));
		}

		return res.json(comments);
	} catch (error) {
		console.log(error);
		return res.status(404).json({ error: 'Post not found' });
	}
};

const router = Router();

router.post('/:identifier/:slug/comments', user, auth, addComment);
router.get('/:identifier/:slug/comments', user, getPostComments);

export default router;
