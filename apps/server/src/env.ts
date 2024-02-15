import { serverEnvSchema } from '@fyp/env'; 

const env = serverEnvSchema.parse(process.env);

export default env;