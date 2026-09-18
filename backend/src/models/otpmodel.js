const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true, lowercase: true, trim: true },
  otp: { type: String, required: true },
  actions: {
    type: String,
    required: true,
    enum: ['verification', 'event_confirmation'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300,
  },
});

otpSchema.index({ email: 1, actions: 1 });

module.exports = mongoose.model('OTP', otpSchema);
