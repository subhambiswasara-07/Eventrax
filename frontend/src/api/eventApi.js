import axiosClient from './axiosClient';

// GET /api/events/all -> Event[] (requires auth, any role)
export const getAllEvents = () => axiosClient.get('/events/all').then((res) => res.data);

// GET /api/events/:id -> Event (requires auth, any role)
export const getEventById = (id) => axiosClient.get(`/events/${id}`).then((res) => res.data);

// POST /api/events/create -> Event (admin only)
export const createEvent = (payload) =>
  axiosClient.post('/events/create', payload).then((res) => res.data);

// PUT /api/events/:id -> Event (admin only)
export const updateEvent = (id, payload) =>
  axiosClient.put(`/events/${id}`, payload).then((res) => res.data);

// DELETE /api/events/:id -> { message } (admin only)
export const deleteEvent = (id) => axiosClient.delete(`/events/${id}`).then((res) => res.data);
