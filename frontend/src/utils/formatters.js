export const formatDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Date TBA';
  return date.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const formatTime = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
};

export const formatPrice = (value) => {
  const num = Number(value);
  if (Number.isNaN(num)) return '—';
  return num === 0 ? 'Free' : `$${num.toFixed(2)}`;
};

export const isPastDate = (value) => new Date(value).getTime() < Date.now();
