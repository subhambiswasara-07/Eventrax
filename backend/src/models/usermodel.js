const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  role: { type: String, required: true, enum: ['user', 'admin'], default: 'user' },
  password: { type: String, required: true, minlength: 6 },
  isVerified: { type: Boolean, default: false },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;
