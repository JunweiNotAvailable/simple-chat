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

// get pretty online strin
export const getPrettyOnlineString = (minutes: number) => {
  if (minutes <= 10) return '目前在線上';
  if (minutes <= 60) return `${minutes}分鐘前上線`;
  if (minutes <= 1440) return `${Math.floor(minutes / 60)}小時前上線`;
  if (minutes <= 43200) return `${Math.floor(minutes / 1440)}天前上線`;
  return '很久以前上線';
}