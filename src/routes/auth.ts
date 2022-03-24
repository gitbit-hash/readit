import { Request, Response, Router } from 'express';
import { validate, isEmpty } from 'class-validator';
import { User } from '../entities/User';
import { AppDataSource } from '../data-source';
import { compare } from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

import { auth } from '../middlewares/auth';

const register = async (req: Request, res: Response) => {
	const { username, email, password } = req.body;

	try {
		// Validate data
		let errors: any = [];

		// Create a user
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

		// Return the user
		return res.json(user);
	} catch (error) {
		console.log(error);
		res.status(500).json(error);
	}
};

const login = async (req: Request, res: Response) => {
	const { username, password } = req.body;

	let errors: any = {};
	if (isEmpty(username)) errors.username = 'Username must not be empty';
	if (isEmpty(password)) errors.password = 'Password must not be empty';
	if (Object.keys(errors).length > 0) return res.status(400).json(errors);

	try {
		const user = await AppDataSource.getRepository(User).findOneBy({
			username,
		});

		if (!user) return res.status(404).json({ error: 'Invalid credintials' });

		const passwordMatched = await compare(password, user.password);

		if (!passwordMatched) {
			return res.status(401).json({ error: 'Invalid credintials' });
		}

		const token = jwt.sign({ username }, process.env.JWT_SECRET);

		res.set(
			'Set-Cookie',
			cookie.serialize('token', token, {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'strict',
				maxAge: 3600,
				path: '/',
			})
		);

		return res.json(user);
	} catch (error) {
		return res.status(500).json(error);
	}
};

const me = (_: Request, res: Response) => {
	return res.json(res.locals.user);
};

const logout = (_: Request, res: Response) => {
	res.set(
		'Set-Cookie',
		cookie.serialize('token', '', {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
			expires: new Date(0),
			path: '/',
		})
	);

	return res.json({ success: true });
};

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', auth, me);
router.get('/logout', auth, logout);

export default router;
