import path from './path';
import recording from './recording';
import client from './client';
import settings from './settings';
import config from './config';

export const registerChannels = () => {
  path();
  recording();
  client();
  settings();
  config();
}
