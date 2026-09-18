const mongoose = require('mongoose');
const Event = require('../models/eventmodel');

const validateEventInput = ({ title, description, date, location, price, totalSeats, availableSeats, imageUrl }) => {
  if (!title?.trim() || !description?.trim() || !date || !location?.trim() || !imageUrl?.trim()) {
    return 'title, description, date, location and imageUrl are required';
  }
  if (!Number.isFinite(Number(price)) || Number(price) < 0) return 'price must be a non-negative number';
  if (!Number.isInteger(Number(totalSeats)) || Number(totalSeats) < 1) return 'totalSeats must be a positive integer';
  if (!Number.isInteger(Number(availableSeats)) || Number(availableSeats) < 0) return 'availableSeats must be a non-negative integer';
  if (Number(availableSeats) > Number(totalSeats)) return 'availableSeats cannot exceed totalSeats';
  if (Number.isNaN(new Date(date).getTime())) return 'date is invalid';
  return null;
};

const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    return res.status(200).json(events);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch events' });
  }
};

const getEventById = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: 'Invalid event id' });
  }

  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    return res.status(200).json(event);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch event' });
  }
};

const createEvent = async (req, res) => {
  const data = req.body;
  const validationError = validateEventInput(data);
  if (validationError) return res.status(400).json({ message: validationError });

  try {
    const event = await Event.create({
      title: data.title.trim(),
      description: data.description.trim(),
      date: new Date(data.date),
      location: data.location.trim(),
      price: Number(data.price),
      totalSeats: Number(data.totalSeats),
      availableSeats: Number(data.availableSeats),
      createdBy: req.user._id,
      imageUrl: data.imageUrl.trim(),
    });
    return res.status(201).json(event);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to create event' });
  }
};

const updateEvent = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: 'Invalid event id' });
  }

  const validationError = validateEventInput(req.body);
  if (validationError) return res.status(400).json({ message: validationError });

  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title.trim(),
        description: req.body.description.trim(),
        date: new Date(req.body.date),
        location: req.body.location.trim(),
        price: Number(req.body.price),
        totalSeats: Number(req.body.totalSeats),
        availableSeats: Number(req.body.availableSeats),
        imageUrl: req.body.imageUrl.trim(),
      },
      { new: true, runValidators: true }
    );

    if (!event) return res.status(404).json({ message: 'Event not found' });
    return res.status(200).json(event);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to update event' });
  }
};

const deleteEvent = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: 'Invalid event id' });
  }

  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    return res.status(200).json({ message: 'Event deleted successfully' });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to delete event' });
  }
};

module.exports = { createEvent, getAllEvents, getEventById, updateEvent, deleteEvent };
