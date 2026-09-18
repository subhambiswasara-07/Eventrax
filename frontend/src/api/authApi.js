import axiosClient from './axiosClient';

// POST /api/auth/register -> { message, token, user } (user.isVerified is false)
export const registerRequest = (payload) =>
  axiosClient.post('/auth/register', payload).then((res) => res.data);

// POST /api/auth/login -> 200 { message, token, user } OR 403 if unverified (OTP re-sent)
export const loginRequest = (payload) =>
  axiosClient.post('/auth/login', payload).then((res) => res.data);

// POST /api/auth/verify-otp -> { message, token, user }
export const verifyOtpRequest = (payload) =>
  axiosClient.post('/auth/verify-otp', payload).then((res) => res.data);
