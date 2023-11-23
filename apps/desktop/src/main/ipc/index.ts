import path from './path';
import recording from './recording';
import client from './client';

export const registerChannels = () => {
  path();
  recording();
  client();
}