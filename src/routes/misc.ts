import { Request, Response, Router } from 'express';
import { AppDataSource } from '../data-source';
import { Comment } from '../entities/Comment';
import { Post } from '../entities/Post';
import { User } from '../entities/User';
import { Vote } from '../entities/Vote';

import { auth } from '../middlewares/auth';
import { user } from '../middlewares/user';

const router = Router();

const vote = async (req: Request, res: Response) => {
	const { identifier, slug, commentIdentifier, value } = req.body;

	// Validate vote value
	if (![1, 0, -1].includes(value)) {
		return res.status(400).send({ value: 'Value must be -1, 0 or 1' });
	}

	try {
		const user: User = res.locals.user;

		let post = await AppDataSource.getRepository(Post).findOneOrFail({
			where: {
				identifier,
				slug,
			},
		});

		let vote: Vote | undefined;
		let comment: Comment | undefined;

		if (commentIdentifier) {
			// If there is a comment identifier, find vote by comment
			comment = await AppDataSource.getRepository(Comment).findOneOrFail({
				where: {
					identifier: commentIdentifier,
				},
			});

			vote = await AppDataSource.getRepository(Vote).findOne({
				// relations: {
				// 	user: true,
				// 	comment: true,
				// },
				where: {
					user: {
						username: user.username,
					},
					comment: {
						identifier: commentIdentifier,
					},
				},
			});
		} else {
			vote = await AppDataSource.getRepository(Vote).findOne({
				// relations: {
				// 	user: true,
				// 	post: true,
				// },
				where: {
					user: {
						username: user.username,
					},
					post: {
						identifier: post.identifier,
					},
				},
			});
		}

		if (!vote && value === 0) {
			return res.status(404).json({ error: 'Vote not found!' });
		} else if (!vote) {
			vote = new Vote({ user, value });
			if (comment) vote.comment = comment;
			else vote.post = post;

			await vote.save();
		} else if (value === 0) {
			await vote.remove();
		} else if (vote.value !== value) {
			vote.value = value;
			await vote.save();
		}

		post = await AppDataSource.getRepository(Post).findOne({
			where: {
				identifier,
				slug,
			},
			relations: ['comments', 'comments.votes', 'sub', 'votes'],
		});

		post.setUserVote(user);
		post.comments.forEach((comment) => comment.setUserVote(user));

		return res.json(post);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ error: 'Something went wrong' });
	}
};

router.post('/vote', user, auth, vote);

export default router;
