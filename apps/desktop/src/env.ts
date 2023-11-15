import { webEnvSchema } from '@fyp/env'; 

const env = webEnvSchema.parse(process.env);

export default env;