
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
    const hours = Math.floor(timeDifference / 3600);
    const remainingTime = timeDifference % 3600;
    const minutes = Math.floor(remainingTime / 60);
    const seconds = Math.floor(remainingTime % 60);
    const formattedHours = hours > 0 ? `${hours < 10 ? `0${hours}` : `${hours}`}h ` : '';
    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    
    return `${formattedHours}${formattedMinutes}m ${formattedSeconds}s`;
}

export const timestampToMinutes = (timestamp: number) => (isFinite(timestamp) && !Number.isNaN(timestamp)) ? timestamp / (1000 * 60) : 0;

export const length = (num: number) => {

    if (num < 0) return "00:00";

    const hours = Math.floor(num / 3600);
    const minutes = Math.floor((num % 3600) / 60);
    const seconds = Math.round(num % 60);

    const hoursString = hours < 10 ? `0${hours}` : `${hours}`;
    const minutesString = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const secondsString = seconds < 10 ? `0${seconds}` : `${seconds}`;

    if (hours > 0) {
        return `${hoursString}:${minutesString}:${secondsString}`;
    } else {
        return `${minutesString}:${secondsString}`;
    }
}

export const msToLength = (milliseconds: number): string => {

    if (milliseconds < 0) return "00:00";

    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600); // 3600 seconds = 1 hour
    const remainingSeconds = totalSeconds % 3600;
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;

    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    if (hours > 0) {
        return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    } else {
        return `${formattedMinutes}:${formattedSeconds}`;
    }
}

export const secToLength = (seconds: number): string => {

    if (seconds < 0) return "00:00";

    const hours = Math.floor(seconds / 3600);
    const remainingSeconds = seconds % 3600;
    const minutes = Math.floor(remainingSeconds / 60);
    const totalSecs = Math.floor(remainingSeconds % 60);

    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(totalSecs).padStart(2, '0');

    if (hours > 0) {
        return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    } else {
        return `${formattedMinutes}:${formattedSeconds}`;
    }
}