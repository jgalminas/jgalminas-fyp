import {test as setup } from '@playwright/test';

setup('authenticate', async ({ request }) => {
  await request.post(process.env.RENDERER_VITE_API_URL + '/v1/auth/login', {
    form: {
      email: 'j.galminas@gmail.com',
      password: 'password'
    }
  });
  await request.storageState({ path: './setup-files/playwright/auth/user.json' });
});
