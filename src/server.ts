import { AppDataSource } from './data-source';
import express from 'express';
import morgan from 'morgan';

import authRoutes from './routes/auth';
import { trim } from './middlewares/trim';

const app = express();
app.use(express.json());
app.use(morgan('dev'));
app.use(trim);

app.get('/', (_, res) => {
	res.send('Hello World');
});

app.use('/api/auth', authRoutes);

app.listen(5000, async () => {
	console.log('Server is up and running at http://localhost:5000');

	try {
		await AppDataSource.initialize();
		console.log('Database connected');
	} catch (error) {
		console.log(error);
	}
});
