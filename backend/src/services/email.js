// //  updated code

// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL,
//     pass: process.env.PASSWORD,
//   },
// });

// transporter.verify((error, success) => {
//   if (error) {
//     console.error("❌ Gmail SMTP connection failed:");
//     console.error(error);
//   } else {
//     console.log("✅ Gmail SMTP server is ready");
//   }
// });

// const sendBookingEmail = async (to, subject, eventname) => {
//   try {
//     const mailOptions = {
//       from: process.env.EMAIL,
//       to,
//       subject,
//       text: `Your booking for the event "${eventname}" has been confirmed.`,
//     };

//     const info = await transporter.sendMail(mailOptions);

//     console.log("✅ Booking email sent:", info.messageId);

//     return info;
//   } catch (error) {
//     console.error("❌ Booking email failed:", error);
//     throw error;
//   }
// };

// const sendotpEmail = async (to, username, subject, type, otp) => {
//   try {
//     const mailOptions = {
//       from: process.env.EMAIL,
//       to,
//       subject,
//       text:
//         type === "verification"
//           ? `Hey ${username}, your OTP for email verification is: ${otp}`
//           : `Hey ${username}, your OTP for event confirmation is: ${otp}`,
//     };

//     const info = await transporter.sendMail(mailOptions);

//     console.log("✅ OTP email sent:", info.messageId);

//     return info;
//   } catch (error) {
//     console.error("❌ OTP email failed:");
//     console.error(error);

//     throw error;
//   }
// };

// module.exports = {
//   sendBookingEmail,
//   sendotpEmail,
// };




const nodemailer = require("nodemailer");
const brevoTransport = require("nodemailer-brevo-transport");

const transporter = nodemailer.createTransport(
  new brevoTransport({
    apiKey: process.env.RESEND_API_KEY,
  }),
);

const sendBookingEmail = async (to, subject, eventname) => {
  try {
    const info = await transporter.sendMail({
      from: `"Eventrax" <${process.env.EMAIL}>`,
      to,
      subject,
      text: `Your booking for the event "${eventname}" has been confirmed.`,
    });

    console.log("✅ Booking email sent via Brevo API:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Booking email failed:", error);
    throw error;
  }
};

const sendotpEmail = async (to, username, subject, type, otp) => {
  try {
    const messageContent =
      type === "verification"
        ? `Hey ${username}, your OTP for email verification is: ${otp}`
        : `Hey ${username}, your OTP for event confirmation is: ${otp}`;

    const info = await transporter.sendMail({
      from: `"Eventrax" <${process.env.EMAIL}>`,
      to,
      subject,
      text: messageContent,
    });

    console.log("✅ OTP email sent via Brevo API:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ OTP email failed:", error);
    throw error;
  }
};

module.exports = {
  sendBookingEmail,
  sendotpEmail,
};