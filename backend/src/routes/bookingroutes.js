
const express = require('express');
const router = express.Router();

const bookingcontroller = require('../controllers/bookingcontroller');
const { protect, admin } = require('../middlewares/protect');

router.post('/', protect, bookingcontroller.bookevent);

router.post('/bookings', protect, bookingcontroller.getmybookings);

router.get('/all', protect, admin, bookingcontroller.getallbookings);

router.post('/send-otp', protect, bookingcontroller.sendbookingotp);

router.post('/:id/confirm', protect, admin, bookingcontroller.confirmbooking);

router.post('/:id', protect, bookingcontroller.cancelbooking);

module.exports = router;
;
