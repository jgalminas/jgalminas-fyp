import { ipcMain } from 'electron';

ipcMain.handle('auth.getSession', async() => {
  return await fetch(process.env.VITE_API_URL + '/v1/auth/session');
});

ipcMain.handle('auth.logIn', async(e) => {

  console.log(e);
  
  // return await fetch(process.env.VITE_API_URL + '/v1/auth/session');
  

  // return await fetch('/api/v1/auth/login', {
  //   method: 'POST',
  //   headers: {
  //     "content-type": "application/json"
  //   },
  //   body: JSON.stringify(credentials)
  // })
});