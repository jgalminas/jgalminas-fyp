import { webEnvSchema } from '@fyp/env'; 

const env = webEnvSchema.parse(import.meta.env);

export default env;