
const mongoose = require('mongoose');
const Booking = require('../models/bookingmodel');
const Event = require('../models/eventmodel');
const OTP = require('../models/otpmodel');
const User = require('../models/usermodel');
const { sendBookingEmail, sendotpEmail } = require('../services/email');

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

const sendbookingotp = async (req, res) => {
  try {
    const otp = generateOtp();

    await OTP.deleteMany({
      email: req.user.email,
      actions: 'event_confirmation',
    });

    await OTP.create({
      email: req.user.email,
      otp,
      actions: 'event_confirmation',
    });

    await sendotpEmail(
      req.user.email,
      req.user.username,
      'Event confirmation',
      'event_confirmation',
      otp,
    );

    return res.status(200).json({ message: 'OTP sent to email' });
  } catch (error) {
    console.error('Send booking OTP error:', error);
    return res.status(500).json({ message: 'Failed to send booking OTP' });
  }
};

const bookevent = async (req, res) => {
  const { eventId, otp } = req.body;

  if (!mongoose.isValidObjectId(eventId) || !/^\d{6}$/.test(String(otp || ''))) {
    return res.status(400).json({
      message: 'Valid eventId and 6-digit OTP are required',
    });
  }

  try {
    const otpExists = await OTP.findOne({
      email: req.user.email,
      otp: String(otp),
      actions: 'event_confirmation',
    });

    if (!otpExists) {
      return res.status(400).json({
        message: 'OTP has expired or is invalid',
      });
    }

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        message: 'Event not found',
      });
    }

    if (event.availableSeats <= 0) {
      return res.status(400).json({
        message: 'No seats available',
      });
    }

    const existsBooking = await Booking.findOne({
      userId: req.user._id,
      eventId,
    });

    if (existsBooking && existsBooking.status !== 'cancelled') {
      return res.status(400).json({
        message: 'You have already booked this event',
      });
    }

    let booking;

    if (existsBooking?.status === 'cancelled') {
      existsBooking.status = 'pending';
      existsBooking.paymentStatus = 'unpaid';
      existsBooking.amount = event.price;
      booking = await existsBooking.save();
    } else {
      booking = await Booking.create({
        userId: req.user._id,
        eventId,
        status: 'pending',
        paymentStatus: 'unpaid',
        amount: event.price,
      });
    }

    await OTP.deleteMany({
      email: req.user.email,
      actions: 'event_confirmation',
    });

    return res.status(201).json({
      message: 'Booking initiated successfully',
      bookingId: booking._id,
      booking,
    });
  } catch (error) {
    console.error('Book event error:', error);

    if (error.code === 11000) {
      return res.status(400).json({
        message: 'You have already booked this event',
      });
    }

    return res.status(500).json({
      message: 'Failed to initiate booking',
    });
  }
};

/*
 * ADMIN
 * Get every booking with customer and event information.
 */
const getallbookings = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate('userId', 'username email role isVerified')
      .populate(
        'eventId',
        'title description date location price totalSeats availableSeats imageUrl'
      )
      .sort({ createdAt: -1 });

    return res.status(200).json(bookings);
  } catch (error) {
    console.error('Get all bookings error:', error);

    return res.status(500).json({
      message: 'Failed to fetch all bookings',
    });
  }
};

/*
 * ADMIN
 * Confirm a pending booking.
 */
const confirmbooking = async (req, res) => {
  const bookingId = req.params.id;

  if (!mongoose.isValidObjectId(bookingId)) {
    return res.status(400).json({
      message: 'Invalid booking id',
    });
  }

  try {
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        message: 'Booking not found',
      });
    }

    if (booking.status === 'confirmed') {
      return res.status(400).json({
        message: 'This booking is already confirmed',
      });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({
        message: 'Cancelled booking cannot be confirmed',
      });
    }

    /*
     * Atomically reserve one available seat.
     * This prevents confirming a booking when no seats remain.
     */
    const event = await Event.findOneAndUpdate(
      {
        _id: booking.eventId,
        availableSeats: { $gt: 0 },
      },
      {
        $inc: { availableSeats: -1 },
      },
      {
        new: true,
      }
    );

    if (!event) {
      return res.status(400).json({
        message: 'No seats available for this event',
      });
    }

    booking.status = 'confirmed';

    /*
     * There is currently no payment gateway in EventraX.
     * Therefore confirmation must not falsely mark payment as paid.
     */
    booking.paymentStatus = 'unpaid';

    await booking.save();

    /*
     * Send confirmation email to the actual customer.
     */
    try {
      const customer = await User.findById(booking.userId).select(
        'email username'
      );

      if (customer?.email) {
        await sendBookingEmail(
          customer.email,
          'Event booking confirmation',
          event.title
        );
      }
    } catch (emailError) {
      console.error(
        'Failed to send booking confirmation email:',
        emailError
      );
    }

    const updatedBooking = await Booking.findById(booking._id)
      .populate('userId', 'username email role isVerified')
      .populate(
        'eventId',
        'title description date location price totalSeats availableSeats imageUrl'
      );

    return res.status(200).json({
      message: 'Booking confirmed successfully',
      booking: updatedBooking,
    });
  } catch (error) {
    console.error('Confirm booking error:', error);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

const getmybookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      userId: req.user._id,
    })
      .populate('eventId')
      .sort({ createdAt: -1 });

    return res.status(200).json(bookings);
  } catch (err) {
    return res.status(500).json({
      message: 'Failed to fetch bookings',
    });
  }
};

const cancelbooking = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({
      message: 'Invalid booking id',
    });
  }

  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: 'Booking not found',
      });
    }

    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'Unauthorized',
      });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({
        message: 'Booking is already cancelled',
      });
    }

    if (booking.status === 'confirmed') {
      const event = await Event.findOneAndUpdate(
        {
          _id: booking.eventId,
          $expr: {
            $lt: ['$availableSeats', '$totalSeats'],
          },
        },
        {
          $inc: { availableSeats: 1 },
        },
        {
          new: true,
        }
      );

      if (!event) {
        const currentEvent = await Event.findById(booking.eventId);

        if (
          currentEvent &&
          currentEvent.availableSeats < currentEvent.totalSeats
        ) {
          currentEvent.availableSeats += 1;
          await currentEvent.save();
        }
      }
    }

    booking.status = 'cancelled';

    await booking.save();

    return res.status(200).json({
      message: 'Booking cancelled successfully',
    });
  } catch (error) {
    console.error('Cancel booking error:', error);

    return res.status(500).json({
      message: 'Failed to cancel booking',
    });
  }
};

module.exports = {
  bookevent,
  getmybookings,
  getallbookings,
  sendbookingotp,
  confirmbooking,
  cancelbooking,
};
;
