import { NextFunction, Request, Response, Router } from 'express';
import { isEmpty } from 'class-validator';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';

import { User } from '../entities/User';
import { Sub } from '../entities/Sub';
import { Post } from '../entities/Post';

import { AppDataSource } from '../data-source';

import { auth } from '../middlewares/auth';
import { user } from '../middlewares/user';

import { makeId } from '../utils/helpers';
import fs from 'fs';

const createSub = async (req: Request, res: Response) => {
	const { name, title, description } = req.body;

	const user: User = res.locals.user;

	const errors: any = {};

	try {
		if (isEmpty(name)) errors.name = 'Name must not be empty!';
		if (isEmpty(title)) errors.title = 'Title must not be empty!';

		const sub = await AppDataSource.getRepository(Sub)
			.createQueryBuilder('sub')
			.where('lower(sub.name) = :name', { name: name.toLowerCase() })
			.getOne();
		if (sub) errors.name = 'Sub exists already!';

		if (Object.keys(errors).length > 0) throw errors;
	} catch (error) {
		return res.status(400).json(error);
	}

	try {
		const sub = new Sub({ name, title, description, user });
		await sub.save();

		return res.json(sub);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ error: 'Somethong went wrong!' });
	}
};

const getSub = async (req: Request, res: Response) => {
	const name = req.params.name;
	try {
		const sub = await AppDataSource.getRepository(Sub).findOneByOrFail({
			name,
		});

		const posts = await AppDataSource.getRepository(Post).find({
			where: {
				sub: {
					name: sub.name,
				},
			},
			order: { createdAt: 'DESC' },
			relations: ['comments', 'votes'],
		});

		sub.posts = posts;

		if (res.locals.user) {
			sub.posts.forEach((post) => post.setUserVote(res.locals.user));
		}

		return res.json(sub);
	} catch (error) {
		console.log(error);
		return res.status(404).json({ sub: 'Sub not found!' });
	}
};

const ownSub = async (req: Request, res: Response, next: NextFunction) => {
	const user: User = res.locals.user;

	try {
		const sub = await AppDataSource.getRepository(Sub).findOneByOrFail({
			name: req.params.name,
		});

		if (sub.username !== user.username) {
			return res.status(403).json({ error: 'You dont own this sub' });
		}

		res.locals.sub = sub;

		return next();
	} catch (error) {
		return res.status(500).json({ error: 'Somethong went wrong!' });
	}
};

const upload = multer({
	storage: multer.diskStorage({
		destination: 'puplic/images',
		filename: (_, file, callback) => {
			const name = makeId(15);
			callback(null, name + path.extname(file.originalname)); // e.g. af342d + (png | jpg)
		},
	}),
	fileFilter: (_, file: any, callback: FileFilterCallback) => {
		console.log(file);
		if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
			console.log('file type');
			callback(null, true);
		} else {
			console.log('error');
			callback(new Error('Not an Image file'));
		}
	},
});

const uploadSubImage = async (req: Request, res: Response) => {
	const sub: Sub = res.locals.sub;

	try {
		const type = req.body.type;

		if (type !== 'image' && type !== 'banner') {
			fs.unlinkSync(req.file.path);
			return res.status(500).json({ error: 'Invalid type' });
		}

		let oldImageUrn: string = '';

		if (type === 'image') {
			oldImageUrn = sub.imageUrn || '';
			sub.imageUrn = req.file.filename;
		} else if (type === 'banner') {
			oldImageUrn = sub.bannerUrn || '';
			sub.bannerUrn = req.file.filename;
		}

		await sub.save();

		if (oldImageUrn !== '') {
			fs.unlinkSync(`puplic\\images\\${oldImageUrn}`);
		}

		return res.json(sub);
	} catch (error) {
		return res.status(500).json({ error: 'Somethong went wrong!' });
	}
};

const searchSubs = async (req: Request, res: Response) => {
	const name = req.params.name;

	try {
		if (isEmpty(name)) {
			return res.status(400).json({ error: 'Name must not be empty.' });
		}

		const subs = await AppDataSource.getRepository(Sub)
			.createQueryBuilder()
			.where('LOWER(name) LIKE :name', {
				name: `${name.toLowerCase().trim()}%`,
			})
			.getMany();
		return res.json(subs);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ error: 'Somethong went wrong!' });
	}
};

const router = Router();

router.post('/', user, auth, createSub);
router.get('/:name', user, getSub);
router.get('/search/:name', searchSubs);
router.post(
	'/:name/image',
	user,
	auth,
	ownSub,
	upload.single('file'),
	uploadSubImage
);

export default router;
