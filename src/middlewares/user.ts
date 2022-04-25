import { NextFunction, Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { User } from '../entities/User';
import jwt from 'jsonwebtoken';

export const user = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const token = req.cookies.token;
		if (!token) return next();

		const { username }: any = jwt.verify(token, process.env.JWT_SECRET);

		const user = await AppDataSource.getRepository(User).findOneBy({
			username,
		});

		res.locals.user = user;

		return next();
	} catch (error) {
		console.log(error);
		return res.status(401).json({ error: 'Unauthenticated' });
	}
};
