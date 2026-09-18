const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending',
  },
  paymentStatus: {
    type: String,
    enum: ['paid', 'unpaid'],
    default: 'unpaid',
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
}, { timestamps: true });

bookingSchema.index({ userId: 1, eventId: 1 }, { unique: true });

module.exports = mongoose.model('Booking', bookingSchema);
