

 

 // Time formatting function
 export const formatTimeAgo = (isoString) => {
  const now = new Date();
  const past = new Date(isoString);
  const seconds = Math.floor((now - past) / 1000);

  const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit);
      if (interval >= 1) {
          return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`;
      }
  }

  return 'Just now';
};

export default formatTimeAgo;