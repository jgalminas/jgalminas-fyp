import { httpServer } from './app';
import env from './env';

const port = process.env.PORT || 5000;

httpServer.listen(port, () => {
  console.log(`Listening: ${env.API_URL}`);
});