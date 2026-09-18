const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/usermodel');
const { sendotpEmail } = require('../services/email');
const OTP = require('../models/otpmodel');

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

const createToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

const register = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username?.trim() || !email?.trim() || !password) {
    return res.status(400).json({ message: 'username, email and password are required' });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  try {
    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username: username.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: 'user',
      isVerified: false,
    });

    const otp = generateOtp();
    await OTP.deleteMany({ email: user.email, actions: 'verification' });
    await OTP.create({ email: user.email, otp, actions: 'verification' });

    try {
      await sendotpEmail(user.email, user.username, 'Registration confirmation', 'verification', otp);
    } catch (emailError) {
      console.error('Failed to send registration OTP:', emailError);
      return res.status(503).json({ message: 'Account created, but OTP email could not be sent. Please try logging in to request another OTP.' });
    }

    return res.status(201).json({
      message: 'User registered successfully. OTP sent to your email.',
      token: createToken(user._id),
      user: { id: user._id, username: user.username, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email?.trim() || !password) {
    return res.status(400).json({ message: 'email and password are required' });
  }

  try {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.isVerified) {
      const otp = generateOtp();
      await OTP.deleteMany({ email: user.email, actions: 'verification' });
      await OTP.create({ email: user.email, otp, actions: 'verification' });
      await sendotpEmail(user.email, user.username, 'Login confirmation', 'verification', otp);

      return res.status(403).json({ message: 'Email not verified. OTP sent to your email.' });
    }

    return res.status(200).json({
      message: 'Login successful',
      token: createToken(user._id),
      user: { id: user._id, username: user.username, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  if (!email?.trim() || !/^\d{6}$/.test(String(otp || ''))) {
    return res.status(400).json({ message: 'Valid email and 6-digit OTP are required' });
  }

  try {
    const normalizedEmail = email.trim().toLowerCase();
    const otpRecord = await OTP.findOne({ email: normalizedEmail, otp: String(otp), actions: 'verification' });

    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isVerified = true;
    await user.save();
    await OTP.deleteMany({ email: normalizedEmail, actions: 'verification' });

    return res.status(200).json({
      message: 'Email verified successfully. You can now log in.',
      token: createToken(user._id),
      user: { id: user._id, username: user.username, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { register, login, verifyOTP };
