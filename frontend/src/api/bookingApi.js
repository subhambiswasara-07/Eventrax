
import axiosClient from './axiosClient';

// POST /api/booking/send-otp
export const sendBookingOtp = () =>
  axiosClient.post('/booking/send-otp').then((res) => res.data);

// POST /api/booking
export const bookEvent = (eventId, otp) =>
  axiosClient.post('/booking', { eventId, otp }).then((res) => res.data);

// POST /api/booking/bookings
export const getMyBookings = () =>
  axiosClient.post('/booking/bookings').then((res) => res.data);

// GET /api/booking/all
// Admin only
export const getAllBookings = () =>
  axiosClient.get('/booking/all').then((res) => res.data);

// POST /api/booking/:id/confirm
// Admin only
export const confirmBooking = (id) =>
  axiosClient.post(`/booking/${id}/confirm`).then((res) => res.data);

// POST /api/booking/:id
// User can cancel their own booking
export const cancelBooking = (id) =>
  axiosClient.post(`/booking/${id}`).then((res) => res.data);

