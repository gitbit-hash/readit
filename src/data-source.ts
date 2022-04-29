import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';

const options: DataSourceOptions & SeederOptions = {
	type: 'postgres',
	host: 'localhost',
	port: 5432,
	username: 'MazeRunner',
	password: 'root',
	database: 'readit',
	synchronize: false,
	logging: true,
	entities: ['src/entities/**/*{.ts,.js}'],
	migrations: ['src/migrations/**/*{.ts,.js}'],
	subscribers: ['src/subscribers/**/*{.ts,.js}'],
	seeds: ['src/seeds/**/*{.ts,.js}'],
};
export const AppDataSource = new DataSource(options);
