import { Request, Response, Router } from 'express';
import { AppDataSource } from '../data-source';
import { Post } from '../entities/Post';
import { Sub } from '../entities/Sub';

import { auth } from '../middlewares/auth';
import { user } from '../middlewares/user';

const createPost = async (req: Request, res: Response) => {
	const { title, body, sub } = req.body;

	const user = res.locals.user;

	if (title.trim() === '') {
		return res.status(400).json({ title: 'Title must not be empty' });
	}

	try {
		// Find sub
		const subRecord = await AppDataSource.getRepository(Sub).findOneByOrFail({
			name: sub,
		});

		const post = new Post({
			title,
			user,
			body,
			sub: subRecord,
		});

		await post.save();
		return res.json(post);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ error: 'Something went wrong!' });
	}
};

const getAllPosts = async (req: Request, res: Response) => {
	const currentPage: number = (req.query.page || 0) as number;
	const postsPerPage: number = (req.query.count || 8) as number;

	try {
		const posts = await AppDataSource.getRepository(Post).find({
			order: { createdAt: 'DESC' },
			relations: ['comments', 'votes', 'sub'],
			skip: currentPage * postsPerPage,
			take: postsPerPage,
		});

		if (res.locals.user) {
			posts.forEach((post) => post.setUserVote(res.locals.user));
		}

		return res.json(posts);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ error: 'Some thing went wrong!' });
	}
};

const getPost = async (req: Request, res: Response) => {
	const { identifier, slug } = req.params;
	try {
		const post = await AppDataSource.getRepository(Post).findOneOrFail({
			where: {
				identifier,
				slug,
			},
			relations: ['sub', 'votes', 'comments'],
		});

		if (res.locals.user) {
			post.setUserVote(res.locals.user);
		}

		return res.json(post);
	} catch (error) {
		console.log(error);
		return res.status(404).json({ error: 'Post not found' });
	}
};

const router = Router();

router.post('/', user, auth, createPost);
router.get('/', user, getAllPosts);
router.get('/:identifier/:slug', user, getPost);

export default router;
