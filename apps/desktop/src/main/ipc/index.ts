import riot from './riot/';
import path from './path';
import recording from './recording';

export const registerChannels = () => {
  riot();
  path();
  recording();
}