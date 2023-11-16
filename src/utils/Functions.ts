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

import axios from "axios";
// send event from pusher
import Pusher from "pusher-js";
import { config } from "./Config";
export const sendEvent = () => {
  const pusher = new Pusher("07ae5689578f057a0669", {
    cluster: "ap3",
  });
  console.log(pusher.send_event('join', {
    message: 'hello'
  }));
}

// file & images

// get extension from filename
export const getExtension = (filename: string) => {
  const extensionIndex = filename.lastIndexOf('.');
    if (extensionIndex === -1) {
      return '';
    }
    return filename.substring(extensionIndex);
}

// upload images to s3
export const uploadImage = async (bucketName: string, imageName: string, url: string) => {
  const imageBase64 = url.split(',')[1];
  await axios.post(`${config.api.s3}/access-image`, {
    bucketName: bucketName,
    name: imageName,
    image: imageBase64,
  });
};

// get image from s3
export const getImageUrl = async (bucketName: string, filename: string) => {
  if (!filename) return '';
  try {
    const response = await axios.get(`${config.api.s3}/access-image?bucketName=${bucketName}&fileName=${filename}`);
    return 'data:image/jpeg;base64,' + response.data;
  } catch (error) {
    return '';
  }
}

