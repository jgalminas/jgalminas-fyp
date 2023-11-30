
export const formatTimeAgo = (timestamp: number): string => {
  const currentTimestamp = Date.now();
  const timeDifference = Math.floor((currentTimestamp - timestamp) / 1000);

  // Define time units in seconds
  const minute = 60;
  const hour = minute * 60;
  const day = hour * 24;
  const month = day * 30.44; // An average month length
  const year = day * 365.25; // An average year length

  // Determine the appropriate time unit
  if (timeDifference < minute) {
      return `${timeDifference} seconds ago`;
  } else if (timeDifference < hour) {
      const minutes = Math.floor(timeDifference / minute);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (timeDifference < day) {
      const hours = Math.floor(timeDifference / hour);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (timeDifference < month) {
      const days = Math.floor(timeDifference / day);
      return `${days} day${days > 1 ? 's' : ''} ago`;
  } else if (timeDifference < year) {
      const months = Math.floor(timeDifference / month);
      return `${months} month${months > 1 ? 's' : ''} ago`;
  } else {
      const years = Math.floor(timeDifference / year);
      return `${years} year${years > 1 ? 's' : ''} ago`;
  }
}

export const formatMatchLength = (start: number, finish: number) => {
  const timeDifference = Math.abs(finish - start) / 1000;
  const minutes = Math.floor(timeDifference / 60);
  const seconds = Math.floor(timeDifference % 60);
  const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const formattedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
  
  return `${formattedMinutes} m ${formattedSeconds}s`;
}

export const timestampToMinutes = (timestamp: number) => timestamp / (1000 * 60);