import summoner from './riot/summoner';
import path from './path';
import recording from './recording/index';

export const registerChannels = () => {
  summoner();
  path();
  recording();
}

export { PathChannels } from './path';
export { RecordingChannels } from './recording/index';
export { SummonerChannels } from './riot/index';