import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema/user';
import env from './env';

const connection = postgres(env.POSTGRESQL_CONNECTION_URI);

export const db = drizzle(connection, { schema, logger: true });