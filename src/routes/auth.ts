import { Request, Response, Router } from 'express';
import { validate } from 'class-validator';
import { User } from '../entities/User';
import { AppDataSource } from '../data-source';

const register = async (req: Request, res: Response) => {
	const { username, email, password } = req.body;

	try {
		// TODO Validate data
		let errors: any = [];

		// TODO Create a user
		const user = new User({ username, email, password });

		errors = await validate(user);
		if (errors.length > 0) {
			return res.status(400).json({ errors });
		}
		const existingUsername = await AppDataSource.getRepository(User).findOneBy({
			username,
		});
		const existingEmail = await AppDataSource.getRepository(User).findOneBy({
			email,
		});

		if (existingUsername) errors.push('Username is already taken');
		if (existingEmail) errors.push('Email is already taken');

		if (errors.length > 0) {
			return res.status(400).json({ errors });
		}

		await user.save();

		// TODO Return the user
		return res.json(user);
	} catch (error) {
		console.log(error);
		res.status(500).json(error);
	}
};

const router = Router();

router.post('/register', register);

export default router;
