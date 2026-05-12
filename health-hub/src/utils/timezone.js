const { formatInTimeZone } = require('date-fns-tz');

const convertToTimeZone = (date, timeZone, pattern = 'yyyy-MM-dd HH:mm:ssXXX') => {
  return formatInTimeZone(new Date(date), timeZone, pattern);
};

const getCurrentTimeInZone = (timeZone) => {
  return formatInTimeZone(new Date(), timeZone, 'yyyy-MM-dd HH:mm:ss');
};

module.exports = {
  convertToTimeZone,
  getCurrentTimeInZone,
};
