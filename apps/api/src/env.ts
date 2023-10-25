import { apiEnvSchema } from '@fyp/env'; 

const env = apiEnvSchema.parse(process.env);

export default env;