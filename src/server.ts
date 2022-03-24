import { AppDataSource } from './data-source';
import express from 'express';
import morgan from 'morgan';
import 'dotenv/config';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth';
import postRoutes from './routes/posts';
import subRoutes from './routes/subs';

import { trim } from './middlewares/trim';

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(morgan('dev'));
app.use(trim);
app.use(cookieParser());

app.get('/', (_, res) => {
	res.send('Hello World');
});

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/subs', subRoutes);

app.listen(PORT, async () => {
	console.log(`Server is up and running at http://localhost:${PORT}`);

	try {
		await AppDataSource.initialize();
		console.log('Database connected');
	} catch (error) {
		console.log(error);
	}
});
