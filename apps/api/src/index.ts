import { app } from './app';
import env from './env';

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Listening: ${env.API_URL}`);
});