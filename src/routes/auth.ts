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
		let errors: any = {};

		// Checking if username or email either exists
		const existingUsername = await AppDataSource.getRepository(User).findOneBy({
			username,
		});
		const existingEmail = await AppDataSource.getRepository(User).findOneBy({
			email,
		});

		if (existingUsername) errors.username = 'Username is already taken';
		if (existingEmail) errors.email = 'Email is already taken';

		if (Object.keys(errors).length > 0) {
			return res.status(400).json(errors);
		}

		// Create a user
		const user = new User({ username, email, password });

		// Validate provided data
		errors = await validate(user);

		if (errors.length > 0) {
			const mappedErrors = errors.reduce((acc: any, curr: any) => {
				if (curr['property']) {
					acc[curr['property']] = Object.entries(curr['constraints'])[0][1];
					return acc;
				}
			}, {});

			return res.status(400).json(mappedErrors);
		}

		// Save user in database
		await user.save();

		// Return the user
		return res.json(user);
	} catch (error) {
		console.log(error);
		return res.status(500).json(error);
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

		if (!user) return res.status(404).json({ username: 'Invalid credintials' });

		const passwordMatched = await compare(password, user.password);

		if (!passwordMatched) {
			return res.status(401).json({ password: 'Invalid credintials' });
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
		return res.json({ error: 'Something went wrong!' });
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
