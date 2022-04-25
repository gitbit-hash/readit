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

const router = Router();

router.post('/:identifier/:slug/comments', user, auth, addComment);

export default router;
