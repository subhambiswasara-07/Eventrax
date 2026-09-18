const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

const sendBookingEmail = async (to, subject, eventname) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to,
    subject,
    text: `Your booking for the event "${eventname}" has been confirmed.`,
  };

  return transporter.sendMail(mailOptions);
};

const sendotpEmail = async (to, username, subject, type, otp) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to,
    subject,
    text: type === 'verification'
      ? `Hey ${username}, your OTP for email verification is: ${otp}`
      : `Hey ${username}, your OTP for event confirmation is: ${otp}`,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = { sendBookingEmail, sendotpEmail };
