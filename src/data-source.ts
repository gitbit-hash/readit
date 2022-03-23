import 'reflect-metadata';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
	type: 'postgres',
	host: 'localhost',
	port: 5432,
	username: 'MazeRunner',
	password: 'root',
	database: 'readit',
	synchronize: true,
	logging: true,
	entities: ['src/entities/**/*.ts'],
	migrations: ['src/migrations/**/*.ts'],
	subscribers: ['src/subscribers/**/*.ts'],
});
