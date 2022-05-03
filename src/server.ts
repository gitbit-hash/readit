import { AppDataSource } from './data-source';
import express from 'express';
import morgan from 'morgan';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import authRoutes from './routes/auth';
import postRoutes from './routes/posts';
import subRoutes from './routes/subs';
import commentRoutes from './routes/comments';
import miscRoutes from './routes/misc';
import userRoute from './routes/users';

import { trim } from './middlewares/trim';

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(morgan('dev'));
app.use(trim);
app.use(cookieParser());
app.use(
	cors({
		credentials: true,
		origin: process.env.ORIGIN,
		optionsSuccessStatus: 200,
	})
);
app.use(express.static('puplic'));

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/subs', subRoutes);
app.use('/api/posts', commentRoutes);
app.use('/api/misc', miscRoutes);
app.use('/api/users', userRoute);

app.listen(PORT, async () => {
	console.log(`Server is up and running at http://localhost:${PORT}`);

	try {
		await AppDataSource.initialize();
		console.log('Database connected');
	} catch (error) {
		console.log(error);
	}
});
