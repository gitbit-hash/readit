import { Request, Response, Router } from 'express';
import { User } from '../entities/User';

const register = async (req: Request, res: Response) => {
	const { username, email, password } = req.body;

	try {
		// TODO Validate data

		// TODO Create a user
		const user = new User({ username, email, password });
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
