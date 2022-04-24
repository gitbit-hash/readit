import { Request, Response, Router } from 'express';

import { User } from '../entities/User';
import { Sub } from '../entities/Sub';
import { auth } from '../middlewares/auth';
import { isEmpty } from 'class-validator';
import { AppDataSource } from '../data-source';

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

const router = Router();

router.post('/', auth, createSub);

export default router;
