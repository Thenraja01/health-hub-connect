const { format, isToday, isFuture, parseISO } = require('date-fns');

const formatDate = (date, pattern = 'yyyy-MM-dd') => {
  return format(new Date(date), pattern);
};

const formatTime = (date) => {
  return format(new Date(date), 'HH:mm');
};

const getRelativeTime = (date) => {
  // Simple relative time implementation
  const now = new Date();
  const diff = now - new Date(date);
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return formatDate(date);
};

module.exports = {
  formatDate,
  formatTime,
  getRelativeTime,
  isToday,
  isFuture,
  parseISO,
};
