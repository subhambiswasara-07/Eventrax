const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  date: { type: Date, required: true },
  location: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  totalSeats: { type: Number, required: true, min: 1 },
  availableSeats: { type: Number, required: true, min: 0 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  imageUrl: { type: String, required: true, trim: true },
}, { timestamps: true });

eventSchema.pre('validate', function () {
  if (this.availableSeats > this.totalSeats) {
    return next(new Error('availableSeats cannot exceed totalSeats'));
  }

});

module.exports = mongoose.model('Event', eventSchema);
