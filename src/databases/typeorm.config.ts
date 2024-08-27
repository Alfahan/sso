import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { DB_HOST, DB_NAME, DB_PASS, DB_PORT, DB_USER } from '@app/const';

config();

export const AppDataSource = new DataSource({
	type: 'postgres',
	host: DB_HOST,
	port: parseInt(DB_PORT),
	username: DB_USER,
	password: DB_PASS,
	database: DB_NAME,
	entities: [__dirname + '/../entities/*.entity{.ts,.js}'],
	synchronize: false,
	logging: true,
	migrations: [`${__dirname}/migrations/*{.ts,.js}`],
	migrationsTableName: 'migrations',
});

export default AppDataSource;
