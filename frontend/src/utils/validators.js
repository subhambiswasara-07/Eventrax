const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const isValidEmail = (value) => EMAIL_RE.test(String(value || '').trim());

export const isValidPassword = (value) => String(value || '').length >= 6;

export const isValidOtp = (value) => /^\d{6}$/.test(String(value || '').trim());

export const passwordStrength = (value) => {
  const password = String(value || '');
  let score = 0;
  if (password.length >= 6) score += 1;
  if (password.length >= 10) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 1) return { label: 'Weak', percent: 25, color: 'bg-flare' };
  if (score <= 3) return { label: 'Okay', percent: 60, color: 'bg-sunbeam' };
  return { label: 'Strong', percent: 100, color: 'bg-electric' };
};

export const validateEventForm = ({ title, description, date, location, price, totalSeats, availableSeats, imageUrl }) => {
  const errors = {};
  if (!title?.trim()) errors.title = 'Title is required';
  if (!description?.trim()) errors.description = 'Description is required';
  if (!date) errors.date = 'Date is required';
  if (!location?.trim()) errors.location = 'Location is required';
  if (!imageUrl?.trim()) errors.imageUrl = 'Image URL is required';
  if (price === '' || Number.isNaN(Number(price)) || Number(price) < 0) {
    errors.price = 'Price must be 0 or more';
  }
  if (!Number.isInteger(Number(totalSeats)) || Number(totalSeats) < 1) {
    errors.totalSeats = 'Total seats must be a positive whole number';
  }
  if (!Number.isInteger(Number(availableSeats)) || Number(availableSeats) < 0) {
    errors.availableSeats = 'Available seats must be 0 or more';
  }
  if (
    Number.isInteger(Number(totalSeats)) &&
    Number.isInteger(Number(availableSeats)) &&
    Number(availableSeats) > Number(totalSeats)
  ) {
    errors.availableSeats = 'Available seats cannot exceed total seats';
  }
  return errors;
};
