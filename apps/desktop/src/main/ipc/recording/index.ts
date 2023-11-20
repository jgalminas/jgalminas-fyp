import file from './file';
import sources from './sources';

export enum RecordingChannels {
  Videos = "recording:videos",
  Thumbnails = "recording:thumbnails",
  Sources = "recording:sources"
}
 
export default () => {
  file();
  sources();
}