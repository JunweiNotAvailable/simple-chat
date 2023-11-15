// generate random string with given length
export const getRandomString = (length: number): string => {
  return Array.from({ length: length }, () =>
    Math.random().toString(36).charAt(2)
  ).join('');
}

// get minutes between time
export const getMinutesBetween = (t1: Date, t2: Date) => {
  const diff = t2.getTime() - t1.getTime();
  return Math.abs(Math.floor(diff / 60000));
}

// get date string
export const getDateString = (date: Date) => {
  return `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, '0')}-${`${date.getDate()}`.padStart(2, '0')}`;
}

// get time string (hh:mm)
export const getTimeString = (time: Date) => {
  return `${String(time.getHours()).padStart(2, '0')}:${String(time.getMinutes()).padStart(2, '0')}`
}

// convert 24 format to 12 format
export const to12HourFormat = (time24: string) => {
  const [hours, minutes] = time24.split(':').map(Number);
  const period = hours >= 12 ? 
    hours > 18 ? '晚上' : '下午'
    : hours < 6 ? '凌晨' : '早上';
  const hours12 = (hours % 12 || 12).toString();
  return `${period}${hours12}:${minutes.toString().padStart(2, '0')}`;
}

// send event from pusher
import Pusher from "pusher-js";
export const sendEvent = () => {
  const pusher = new Pusher("07ae5689578f057a0669", {
    cluster: "ap3",
  });
  console.log(pusher.send_event('join', {
    message: 'hello'
  }));
}