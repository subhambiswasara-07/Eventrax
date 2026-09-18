const express = require('express');
const router = express.Router();
const eventcontroller = require('../controllers/eventcontroller');
const { protect, admin } = require('../middlewares/protect');


router.post('/create', protect, admin, eventcontroller.createEvent);
router.get('/all', protect, eventcontroller.getAllEvents);
router.get('/:id', protect, eventcontroller.getEventById);
router.put('/:id', protect, admin, eventcontroller.updateEvent);
router.delete('/:id', protect, admin, eventcontroller.deleteEvent);

module.exports = router;