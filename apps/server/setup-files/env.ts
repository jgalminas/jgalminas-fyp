import dotenv from 'dotenv';
import { expand } from 'dotenv-expand';
import { join } from 'path';

const env = dotenv.config({ path: join(__dirname, '..', '..', '..', '.env') });
expand(env);

export default env;